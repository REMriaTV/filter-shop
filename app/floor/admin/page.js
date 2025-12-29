'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import Link from 'next/link';

// ---------------------------------------------------------
// 1. 初期データ定義 (前回と同じ)
// ---------------------------------------------------------
const INITIAL_TREE = {
  'root': {
    id: 'root', type: 'folder', name: 'ROOT', isOpen: true,
    children: {
      'folder_plot': {
        id: 'folder_plot', type: 'folder', name: 'Plot & Settings', isOpen: true, isPinned: true,
        children: {
          'master_plot.db': {
            id: 'master_plot.db', type: 'db', name: 'master_plot.db',
            content: [
              { id: 1, chapter: "1章 手", place: "教室", status: "DONE", synopsis: "男子中学生の瀬田は幼馴染の煽りに反応し...", events: "- 瀬田の手繋ぎ童貞がクラス全員にバラされる" },
              { id: 2, chapter: "2章 ハンカチ", place: "渡り廊下", status: "DONE", synopsis: "授業が始まっても...", events: "- 川原さんのハンカチを見つける" },
            ]
          },
          'characters.md': {
            id: 'characters.md', type: 'code', name: 'characters.md',
            content: '# 登場人物メモ\n\n- 瀬田: 主人公。中二病気質。\n- 川原海美: ヒロイン。\n'
          }
        }
      },
      'folder_draft': {
        id: 'folder_draft', type: 'folder', name: 'Drafts', isOpen: true,
        children: {
          'folder_ch1': {
            id: 'folder_ch1', type: 'folder', name: '1_手', isOpen: false,
            children: {
              'ch1_text.txt': { 
                id: 'ch1_text.txt', type: 'code', name: 'main.txt', 
                content: `好きな子と付き合えたら何したい？と聞かれて、「手を握るだけでいい」と答えたら「またまたぁ〜笑」「お前なにかっこつけてんだよ〜！」
そんな下心だけで生きてるわけではない。いや、むしろ心から好きな相手だからこそ手を握るだけで十分に幸せなのだ。「異性と手を繋いだことがないからだろ」

男子中学生の噂話は隠す気がないから嘘のように広まるのが早い。
なんか聞いたんだけどさー、瀬田くんて女子と体育の授業以外で手を繋いだことないんだってー？私、つないであげようか？
僕がこのクラスで密かに想い続けている川原さんと親友で、男勝りな性格の横野だ。ノリが良く普段から男女分け目なく接するムードメーカーだが、僕にとっては天敵だ。
「いや、なんなん自分？なんで上からなん？女子と手を繋いだことないからって馬鹿にするなや！・・・言っておくけどォ、妄想世界で俺はこんなもんじゃないからな？」
何を血迷ったか逆上した瀬田はあらぬことを口走り、それは当然同じ空間にいる川原さんにも届いていた。

しーんという静けさを表す擬態語は、実は音として聞こえる擬音語だったようで、教室中が凍りつく中最初に物音を立てたのはあの川原さんだった。
「あんた何言ってんの！？バッカじゃないのマジで！」
横野はバレー部仕込みのアタック動作で男子の頭にツッコミを入れるから、笑いも起きるがその分ダメージも大きい。
「痛ってーな！リンゴ！ニュートンじゃないんだから引力利用して頭たくなや！」
横野とは小学校から一緒なだけに、あだ名の志保リンを文字ってリンゴと呼んでいる。
「それを言うなら重力でしょ！高さによって重力加速度がプラスされるのよ」
まさかの''手つなぎ童貞''が発覚した上にオチまでついて再び賑やかさを取り戻したクラスに、３時限目のチャイムが鳴った。` 
              }
            }
          },
          'folder_ch2': { id: 'folder_ch2', type: 'folder', name: '2_ハンカチ', isOpen: false, children: {} }
        }
      },
      'memo.txt': { id: 'memo.txt', type: 'code', name: 'memo.txt', content: '執筆メモ\n- ハンカチのデザインを決める\n' }
    }
  }
};

// ---------------------------------------------------------
// 2. カスタムフック: ファイルシステム (変更なし)
// ---------------------------------------------------------
const useFileSystem = () => {
  const [fileTree, setFileTree] = useState(INITIAL_TREE);
  const [isReady, setIsReady] = useState(false);
  const [unsavedFiles, setUnsavedFiles] = useState(new Set());
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('filter_shop_fs_v8_txt_fix');
    if (saved) { try { setFileTree(JSON.parse(saved)); } catch(e) { console.error(e); } }
    setIsReady(true);
  }, []);

  const saveToStorage = (tree) => { localStorage.setItem('filter_shop_fs_v8_txt_fix', JSON.stringify(tree)); };

  const findNode = (tree, id) => {
    if (tree[id]) return tree[id];
    for (const key in tree) {
      if (tree[key].children) {
        const found = findNode(tree[key].children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodeInTree = (tree, id, updater) => {
    const newTree = { ...tree };
    for (const key in newTree) {
      if (key === id) { newTree[key] = updater(newTree[key]); return newTree; }
      if (newTree[key].children) { newTree[key].children = updateNodeInTree(newTree[key].children, id, updater); }
    }
    return newTree;
  };

  const addChildToParent = (tree, parentId, newChild) => {
    if (!parentId || parentId === 'root') {
      const root = { ...tree.root }; root.children = { ...root.children, [newChild.id]: newChild }; return { ...tree, root };
    }
    return updateNodeInTree(tree, parentId, (node) => ({ ...node, children: { ...node.children, [newChild.id]: newChild }, isOpen: true }));
  };

  const moveItem = useCallback((sourceId, targetId) => {
    if (sourceId === targetId) return;
    const sourceNode = JSON.parse(JSON.stringify(findNode(fileTree, sourceId)));
    if (!sourceNode) return;
    const isDescendant = (node, target) => {
        if (!node.children) return false;
        if (node.children[target]) return true;
        return Object.values(node.children).some(child => isDescendant(child, target));
    };
    if (sourceNode.type === 'folder' && isDescendant(sourceNode, targetId)) { alert("Cannot move a folder into its own child."); return; }
    const targetNode = findNode(fileTree, targetId);
    if (targetNode.type !== 'folder' && targetId !== 'root') return; 
    setFileTree(prev => {
      const deleteFromTree = (tree, tId) => {
        const newTree = { ...tree };
        for (const key in newTree) {
          if (key === tId) { delete newTree[key]; return newTree; }
          if (newTree[key].children) { newTree[key].children = deleteFromTree(newTree[key].children, tId); }
        }
        return newTree;
      };
      const treeWithoutSource = deleteFromTree(prev, sourceId);
      const finalTree = addChildToParent(treeWithoutSource, targetId, sourceNode);
      saveToStorage(finalTree); return finalTree;
    });
  }, [fileTree]);

  const updateFileContent = useCallback((id, newContent) => {
    setFileTree(prev => updateNodeInTree(prev, id, node => ({ ...node, content: newContent })));
    setUnsavedFiles(prev => new Set(prev).add(id));
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setFileTree(latest => { saveToStorage(latest); return latest; });
      setUnsavedFiles(prev => { const next = new Set(prev); next.delete(id); return next; });
    }, 1000);
  }, []);

  const updatePlotRow = useCallback((fileId, rowId, field, value) => {
    setFileTree(prev => updateNodeInTree(prev, fileId, node => {
        const newContent = node.content.map(row => row.id === rowId ? { ...row, [field]: value } : row);
        return { ...node, content: newContent };
    }));
    setUnsavedFiles(prevSet => new Set(prevSet).add(fileId));
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setFileTree(latest => { saveToStorage(latest); return latest; });
      setUnsavedFiles(prev => { const n = new Set(prev); n.delete(fileId); return n; });
    }, 1000);
  }, []);

  const createItem = useCallback((parentId, name, type) => {
    if (!name.trim()) return { success: false };
    const id = `${name}_${Date.now()}`;
    const newItem = { id, type, name, content: type === 'folder' ? null : (type === 'db' ? [] : ''), children: type === 'folder' ? {} : null, isOpen: true, isPinned: false };
    setFileTree(prev => { const next = addChildToParent(prev, parentId, newItem); saveToStorage(next); return next; });
    return { success: true, id };
  }, []);

  const deleteItem = useCallback((id) => {
    if (!confirm("Delete this item?")) return false;
    setFileTree(prev => { 
        const deleteFromTree = (tree, targetId) => {
            const newTree = { ...tree };
            for (const key in newTree) {
              if (key === targetId) { delete newTree[key]; return newTree; }
              if (newTree[key].children) { newTree[key].children = deleteFromTree(newTree[key].children, targetId); }
            }
            return newTree;
        };
        const next = deleteFromTree(prev, id); saveToStorage(next); return next; 
    });
    return true;
  }, []);

  const renameItem = useCallback((id, newName) => {
    if (!newName.trim()) return;
    setFileTree(prev => { const next = updateNodeInTree(prev, id, node => ({ ...node, name: newName })); saveToStorage(next); return next; });
  }, []);

  const toggleFolder = useCallback((id) => {
    setFileTree(prev => updateNodeInTree(prev, id, node => ({ ...node, isOpen: !node.isOpen })));
  }, []);
  const togglePin = useCallback((id) => {
    setFileTree(prev => { const next = updateNodeInTree(prev, id, node => ({ ...node, isPinned: !node.isPinned })); saveToStorage(next); return next; });
  }, []);

  const getFile = useCallback((id) => findNode(fileTree, id), [fileTree]);
  const getAllFiles = useCallback(() => {
    const files = [];
    const traverse = (tree) => { for (const key in tree) { const node = tree[key]; if (node.type !== 'folder') files.push(node); if (node.children) traverse(node.children); } };
    traverse(fileTree); return files;
  }, [fileTree]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(fileTree, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = `backup_${new Date().toISOString().slice(0,10)}.json`; link.click();
  }, [fileTree]);

  const importData = useCallback((e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { try { const imported = JSON.parse(event.target.result); if (imported.root) { setFileTree(imported); saveToStorage(imported); alert("Imported!"); } else alert("Invalid file"); } catch (err) { alert("Parse Error"); } };
    reader.readAsText(file);
  }, []);

  return { fileTree, unsavedFiles, updateFileContent, updatePlotRow, createItem, deleteItem, renameItem, toggleFolder, togglePin, getFile, getAllFiles, moveItem, exportData, importData, isReady };
};

// ---------------------------------------------------------
// 3. UIコンポーネント (ContextMenu, Tree, ActivityBar, Search)
// ---------------------------------------------------------
const ContextMenu = ({ x, y, onClose, onAction, targetType, isPinned }) => (
  <>
    <div className="fixed inset-0 z-40" onClick={onClose}></div>
    <div style={{ top: y, left: x }} className="fixed z-50 bg-[#252526] border border-[#454545] shadow-xl py-1 rounded min-w-[160px] text-xs text-gray-300">
      <div onClick={() => onAction('new_file')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer">New File</div>
      <div onClick={() => onAction('new_folder')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer">New Folder</div>
      <div onClick={() => onAction('new_db')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer">New Plot (.db)</div>
      <div className="h-px bg-[#454545] my-1 mx-2"></div>
      {targetType !== 'root' && <div onClick={() => onAction('toggle_pin')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer flex justify-between">{isPinned ? "Unpin" : "Pin"} {isPinned && "★"}</div>}
      {targetType !== 'root' && <><div className="h-px bg-[#454545] my-1 mx-2"></div><div onClick={() => onAction('rename')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer">Rename</div><div onClick={() => onAction('delete')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer text-red-400">Delete</div></>}
    </div>
  </>
);

const ChevronRight = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const ChevronDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const PinIcon = () => <span className="text-[9px] text-yellow-500 mr-1 transform rotate-45">📌</span>;

const getSortedChildren = (children) => Object.values(children).sort((a, b) => {
  if (a.isPinned && !b.isPinned) return -1; if (!a.isPinned && b.isPinned) return 1;
  if (a.type === 'folder' && b.type !== 'folder') return -1; if (a.type !== 'folder' && b.type === 'folder') return 1;
  return a.name.localeCompare(b.name, undefined, { numeric: true });
});

const TreeNode = ({ node, level = 0, activeId, onSelect, onToggle, onContextMenu, onMove }) => {
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeId;
  const indent = level * 10 + 10;
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e) => { e.dataTransfer.setData("application/json", JSON.stringify({ id: node.id })); e.stopPropagation(); };
  const handleDragOver = (e) => { e.preventDefault(); if (isFolder) { e.stopPropagation(); setIsDragOver(true); } };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); if (!isFolder) return; const data = JSON.parse(e.dataTransfer.getData("application/json")); if (data.id !== node.id) onMove(data.id, node.id); };

  if (node.id === 'root') {
    const sorted = getSortedChildren(node.children);
    return (
      <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const data = JSON.parse(e.dataTransfer.getData("application/json")); onMove(data.id, 'root'); }} className="h-full flex flex-col">
        {sorted.map(child => <TreeNode key={child.id} node={child} level={0} activeId={activeId} onSelect={onSelect} onToggle={onToggle} onContextMenu={onContextMenu} onMove={onMove} />)}
        <div className="flex-1 min-h-[50px]" onContextMenu={(e) => onContextMenu(e, 'root', 'folder', false)}></div>
      </div>
    );
  }
  return (
    <div>
      <div className={`flex items-center py-1 cursor-pointer select-none transition-colors ${isActive ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'} ${isDragOver ? 'bg-[#094771] border-2 border-blue-400' : 'border-2 border-transparent'}`} style={{ paddingLeft: `${indent}px` }} onClick={(e) => { e.stopPropagation(); if (isFolder) onToggle(node.id); else onSelect(node.id); }} onContextMenu={(e) => onContextMenu(e, node.id, node.type, node.isPinned)} draggable="true" onDragStart={handleDragStart} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        <div className="w-5 flex items-center justify-center text-gray-500">{isFolder && (node.isOpen ? <ChevronDown /> : <ChevronRight />)}</div>
        {node.isPinned && <PinIcon />}
        <span className={`truncate text-xs ${isFolder ? 'font-bold text-gray-200' : ''}`}>{node.name}</span>
      </div>
      {isFolder && node.isOpen && <div>{getSortedChildren(node.children).map(child => <TreeNode key={child.id} node={child} level={level + 1} activeId={activeId} onSelect={onSelect} onToggle={onToggle} onContextMenu={onContextMenu} onMove={onMove} />)}</div>}
    </div>
  );
};

const ActivityBar = ({ activeView, onSelect }) => (
  <div className="w-12 bg-[#333333] flex flex-col items-center py-2 border-r border-[#1e1e1e] select-none z-10 justify-between h-full">
    <div>
      <div onClick={() => onSelect('explorer')} className={`w-10 h-10 flex items-center justify-center mb-2 cursor-pointer border-l-2 ${activeView === 'explorer' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`} title="Explorer">🗂</div>
      <div onClick={() => onSelect('search')} className={`w-10 h-10 flex items-center justify-center mb-2 cursor-pointer border-l-2 ${activeView === 'search' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`} title="Search">🔍</div>
    </div>
    <div onClick={() => onSelect('settings')} className={`w-10 h-10 flex items-center justify-center mb-2 cursor-pointer border-l-2 ${activeView === 'settings' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`} title="Settings">⚙️</div>
  </div>
);

const SearchPane = ({ files, onOpenFile }) => {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    if (!query) return [];
    const hits = [];
    files.forEach(file => {
      if (file.type === 'code') {
        const lines = file.content.split('\n');
        lines.forEach((line, i) => { if (line.toLowerCase().includes(query.toLowerCase())) hits.push({ fileId: file.id, fileName: file.name, line: i + 1, text: line.trim() }); });
      }
    });
    return hits;
  }, [query, files]);
  return (
    <div className="flex flex-col h-full bg-[#252526]">
      <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">SEARCH</div>
      <div className="px-4 pb-2"><input className="w-full bg-[#3c3c3c] border border-transparent focus:border-blue-500 text-white text-xs px-2 py-1 outline-none rounded-sm" placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} /></div>
      <div className="flex-1 overflow-y-auto mt-2">
        {results.map((hit, i) => (
          <div key={i} onClick={() => onOpenFile(hit.fileId)} className="px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer group">
            <div className="flex items-center text-xs text-gray-300"><span className="text-blue-400 mr-2 font-bold">{hit.fileName}</span><span className="text-gray-500 text-[10px] bg-[#1e1e1e] px-1 rounded-full">{hit.line}</span></div>
            <div className="text-[10px] text-gray-500 pl-2 truncate group-hover:text-gray-300">{hit.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsPane = ({ onExport, onImport }) => (
  <div className="flex flex-col h-full bg-[#252526] p-4 text-gray-300">
    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-4">SETTINGS</div>
    <div className="mb-6">
      <h3 className="text-xs font-bold mb-2 text-white">Data Management</h3>
      <button onClick={onExport} className="w-full bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs py-2 rounded mb-3">⬇ Export Backup (.json)</button>
      <label className="w-full bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white text-xs py-2 rounded flex items-center justify-center cursor-pointer">⬆ Import Backup<input type="file" accept=".json" onChange={onImport} className="hidden" /></label>
    </div>
  </div>
);

const TabBar = ({ tabs, activeTabId, unsavedFiles, onTabClick, onCloseTab, fileSystem }) => (
  <div className="flex bg-[#252526] h-9 items-center overflow-x-auto no-scrollbar">
    {tabs.map(fileId => {
      const file = fileSystem.getFile(fileId); if (!file) return null;
      const isActive = fileId === activeTabId;
      const isDirty = unsavedFiles.has(fileId);
      return (
        <div key={fileId} onClick={() => onTabClick(fileId)} className={`group flex items-center min-w-[120px] max-w-[200px] h-full px-3 text-xs cursor-pointer border-r border-[#1e1e1e] select-none ${isActive ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'bg-[#2d2d2d] text-gray-400 hover:bg-[#2a2d2e] border-t-2 border-t-transparent'}`}>
          <span className={`mr-2 ${file.type === 'db' ? 'text-blue-400' : 'text-yellow-400'}`}>{file.type === 'db' ? '▦' : 'JS'}</span>
          <span className="truncate flex-1">{file.name}</span>
          <div className="ml-2 w-5 h-5 flex items-center justify-center">
              {isDirty ? <span className="text-[10px] text-white">●</span> : <button onClick={(e) => onCloseTab(e, fileId)} className={`w-full h-full rounded-md hover:bg-gray-600 flex items-center justify-center ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>×</button>}
          </div>
        </div>
      );
    })}
  </div>
);

const PlotGrid = ({ data, onUpdate }) => (
  <div className="w-full h-full overflow-auto bg-[#1e1e1e] p-4 text-xs font-mono">
    <table className="w-full border-collapse text-left">
      <thead><tr className="text-gray-500 border-b border-gray-700"><th className="p-2 w-12">No.</th><th className="p-2 w-24">章</th><th className="p-2 w-20">場所</th><th className="p-2 w-1/3">あらすじ</th><th className="p-2 w-1/3">出来事</th><th className="p-2 w-20 text-center">Status</th></tr></thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-b border-gray-800 hover:bg-[#2a2d2e] group transition-colors align-top">
            <td className="p-2 text-gray-500 pt-3">{String(row.id).padStart(2, '0')}</td>
            <td className="p-2 text-blue-400 font-bold pt-3">{row.chapter}</td>
            <td className="p-2 text-yellow-500 pt-3">{row.place}</td>
            <td className="p-2"><textarea className="w-full bg-transparent resize-none outline-none text-gray-300 min-h-[80px] p-1 rounded" value={row.synopsis} onChange={(e) => onUpdate(row.id, 'synopsis', e.target.value)} /></td>
            <td className="p-2"><textarea className="w-full bg-transparent resize-none outline-none text-gray-400 min-h-[80px] p-1 rounded" value={row.events || ''} onChange={(e) => onUpdate(row.id, 'events', e.target.value)} /></td>
            <td className="p-2 text-center pt-3">
              <select value={row.status} onChange={(e) => onUpdate(row.id, 'status', e.target.value)} className={`bg-transparent border rounded px-1 py-0.5 text-[10px] outline-none ${row.status === 'DONE' ? 'border-green-800 text-green-500' : 'border-gray-700'}`}>
                <option value="TODO">TODO</option><option value="WIP">WIP</option><option value="DONE">DONE</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatusBar = ({ activeFile, logs }) => {
  const wordCount = activeFile && activeFile.type === 'code' ? activeFile.content.length : 0;
  const status = logs.length > 0 ? logs[logs.length - 1] : 'Ready';
  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[10px] justify-between select-none shrink-0">
      <div className="flex gap-4"><span className="flex items-center gap-1"><span className="font-bold">⚡</span> {status.replace('> ', '')}</span></div>
      <div className="flex gap-4">{activeFile && activeFile.type === 'code' && <span>{wordCount} Chars</span>}<span>UTF-8</span></div>
    </div>
  );
};

// ★新機能: 縦書きプレビューコンポーネント
const VerticalPreview = ({ content }) => {
  return (
    <div className="h-full w-full bg-[#f8f8f0] text-black overflow-x-auto overflow-y-hidden border-l border-gray-700">
      <div 
        className="h-full p-10 font-serif text-lg leading-loose tracking-widest min-w-[600px]"
        style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
      >
        {content.split('\n').map((line, i) => (
          <p key={i} className={line === '' ? 'h-8' : ''}>
            {line || ''}
          </p>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// 6. メインページ (統合)
// ---------------------------------------------------------
export default function AdminRoom() {
  const fs = useFileSystem();
  const [tabs, setTabs] = useState(['master_plot.db']);
  const [activeTabId, setActiveTabId] = useState('master_plot.db');
  const [logs, setLogs] = useState(['> System initialized.', '> Vertical preview enabled.']);
  const [sidebarView, setSidebarView] = useState('explorer');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, targetId: null, targetType: null, isPinned: false });
  
  // ★プレビュー表示フラグ
  const [showPreview, setShowPreview] = useState(false);

  const handleContextMenu = useCallback((e, targetId, targetType, isPinned) => { e.preventDefault(); setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetId, targetType, isPinned }); }, []);
  const handleContextMenuAction = (action) => {
    const { targetId, targetType } = contextMenu;
    let parentId = targetType === 'folder' ? targetId : 'root'; 
    if (action === 'new_file') { const name = prompt("File Name:"); if (name) fs.createItem(parentId, name, 'code'); }
    else if (action === 'new_folder') { const name = prompt("Folder Name:"); if (name) fs.createItem(parentId, name, 'folder'); }
    else if (action === 'new_db') { let name = prompt("Plot (.db):"); if (name) { if (!name.endsWith('.db')) name += '.db'; fs.createItem(parentId, name, 'db'); } }
    else if (action === 'rename') { const name = prompt("Rename:", fs.getFile(targetId)?.name); if (name) fs.renameItem(targetId, name); }
    else if (action === 'delete') fs.deleteItem(targetId);
    else if (action === 'toggle_pin') fs.togglePin(targetId);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const openTab = (id) => { setTabs(prev => !prev.includes(id) ? [...prev, id] : prev); setActiveTabId(id); };
  const closeTab = (e, id) => { e.stopPropagation(); setTabs(prev => { const next = prev.filter(t => t !== id); if (activeTabId === id) setActiveTabId(next[next.length - 1] || null); return next; }); };

  const getLanguage = (fileName) => { if (!fileName) return 'plaintext'; if (fileName.endsWith('.js')) return 'javascript'; if (fileName.endsWith('.md')) return 'markdown'; if (fileName.endsWith('.json')) return 'json'; return 'plaintext'; };

  if (!fs.isReady) return <div className="bg-[#1e1e1e] h-screen text-gray-500 p-10 font-mono">Loading...</div>;
  const activeFile = fs.getFile(activeTabId);

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-gray-300 font-mono text-sm overflow-hidden flex-col" onClick={() => setContextMenu({ ...contextMenu, visible: false })} onContextMenu={(e) => e.preventDefault()}>
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar activeView={sidebarView} onSelect={setSidebarView} />

        <div className="w-64 border-r border-gray-700 flex flex-col bg-[#252526] select-none h-full">
           {sidebarView === 'settings' ? <SettingsPane onExport={fs.exportData} onImport={fs.importData} /> : 
             <><div className="px-4 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-500" onContextMenu={(e) => handleContextMenu(e, 'root', 'folder', false)}>{sidebarView === 'explorer' ? 'EXPLORER' : 'SEARCH'}</div>
             <div className="flex-1 overflow-y-auto">{sidebarView === 'explorer' ? <TreeNode node={fs.fileTree.root} activeId={activeTabId} onSelect={openTab} onToggle={fs.toggleFolder} onContextMenu={handleContextMenu} onMove={fs.moveItem} /> : <SearchPane files={fs.getAllFiles()} onOpenFile={openTab} />}</div></>}
        </div>

        <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
          <div className="flex bg-[#252526] h-9 items-center border-b border-[#1e1e1e] pr-4">
            <div className="flex-1 overflow-hidden h-full"><TabBar tabs={tabs} activeTabId={activeTabId} unsavedFiles={fs.unsavedFiles} onTabClick={setActiveTabId} onCloseTab={closeTab} fileSystem={fs} /></div>
            
            {/* ★プレビューボタン追加 */}
            {activeFile?.type === 'code' && (
              <button 
                onClick={() => setShowPreview(!showPreview)} 
                className={`ml-2 text-[10px] px-3 py-1 rounded flex items-center gap-1 shrink-0 transition-colors ${showPreview ? 'bg-blue-600 text-white' : 'bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]'}`}
              >
                <span>📖</span> Preview
              </button>
            )}
          </div>

          <div className="flex-1 overflow-hidden relative flex">
            {!activeFile ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-4"><div className="text-4xl opacity-20">FILTER SHOP IDE</div></div>
            ) : activeFile.type === 'db' ? (
              <PlotGrid data={activeFile.content} onUpdate={(rowId, field, val) => fs.updatePlotRow(activeFile.id, rowId, field, val)} />
            ) : (
              // ★分割表示ロジック
              <>
                <div className={`${showPreview ? 'w-1/2' : 'w-full'} h-full border-r border-gray-700`}>
                  <Editor
                    height="100%"
                    language={getLanguage(activeFile.name)}
                    theme="vs-dark"
                    value={activeFile.content}
                    onChange={(value) => fs.updateFileContent(activeFile.id, value)}
                    options={{ minimap: { enabled: !showPreview }, fontSize: 14, fontFamily: "'Menlo', monospace", automaticLayout: true, padding: { top: 10 }, wordWrap: 'on' }}
                  />
                </div>
                {/* プレビュー画面 */}
                {showPreview && (
                  <div className="w-1/2 h-full">
                    <VerticalPreview content={activeFile.content} />
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* ログ画面 (プレビュー中は邪魔なので隠す、または小さくする) */}
          {!showPreview && activeFile?.type === 'code' && (
            <div className="h-24 border-t border-gray-700 bg-[#1e1e1e] overflow-auto p-2 text-xs text-green-500">
               {logs.map((l, i) => <div key={i} className="mb-0.5 border-b border-gray-800/50">{l}</div>)}
            </div>
          )}
        </div>
      </div>
      <StatusBar activeFile={activeFile} logs={logs} />
      {contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} targetType={contextMenu.targetType} isPinned={contextMenu.isPinned} onClose={() => setContextMenu({ ...contextMenu, visible: false })} onAction={handleContextMenuAction} />}
    </div>
  );
}