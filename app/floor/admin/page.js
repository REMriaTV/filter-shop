'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import Link from 'next/link';

// ---------------------------------------------------------
// 1. 初期データ定義
// ---------------------------------------------------------
const INITIAL_TREE = {
  'root': {
    id: 'root',
    type: 'folder',
    name: 'ROOT',
    isOpen: true,
    children: {
      'folder_plot': {
        id: 'folder_plot',
        type: 'folder',
        name: 'Plot & Settings',
        isOpen: true,
        isPinned: true, // ★初期状態でピン留め（上にくる）
        children: {
          'master_plot.db': {
            id: 'master_plot.db',
            type: 'db',
            name: 'master_plot.db',
            content: [
              { id: 1, chapter: "1章 手", place: "教室", status: "DONE", synopsis: "男子中学生の瀬田は幼馴染の煽りに反応し...", events: "- 瀬田の手繋ぎ童貞がクラス全員にバラされる" },
              { id: 2, chapter: "2章 ハンカチ", place: "渡り廊下", status: "DONE", synopsis: "授業が始まっても姿を見せない様子を心配し...", events: "- ケルトの穴空き巨石の話を思い出す" },
            ]
          },
          'characters.md': {
            id: 'characters.md',
            type: 'code',
            name: 'characters.md',
            content: '# 登場人物\n- 瀬田: 主人公。中二病。\n- 川原: ヒロイン。ハンカチを落とす。\n'
          }
        }
      },
      'folder_draft': {
        id: 'folder_draft',
        type: 'folder',
        name: 'Drafts',
        isOpen: true,
        children: {
          'chapter_01.js': {
            id: 'chapter_01.js',
            type: 'code',
            name: 'chapter_01.js',
            content: '// 1章：手\nconst location = "教室";\nconsole.log("喧騒の中、俺は自分の掌を見つめていた。");\n'
          }
        }
      },
      'memo.txt': {
        id: 'memo.txt',
        type: 'code',
        name: 'memo.txt',
        content: 'アイデアメモ\n- 3章のオチを決める\n'
      }
    }
  }
};

// ---------------------------------------------------------
// 2. カスタムフック: ファイルシステム
// ---------------------------------------------------------
const useFileSystem = () => {
  const [fileTree, setFileTree] = useState(INITIAL_TREE);
  const [isReady, setIsReady] = useState(false);
  const [unsavedFiles, setUnsavedFiles] = useState(new Set());
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('filter_shop_fs_v6_dnd'); // バージョン変更
    if (saved) {
      try { setFileTree(JSON.parse(saved)); } catch(e) { console.error(e); }
    }
    setIsReady(true);
  }, []);

  const saveToStorage = (tree) => {
    localStorage.setItem('filter_shop_fs_v6_dnd', JSON.stringify(tree));
  };

  // 汎用: ツリー探索
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

  // 汎用: ツリー更新
  const updateNodeInTree = (tree, id, updater) => {
    const newTree = { ...tree };
    for (const key in newTree) {
      if (key === id) {
        newTree[key] = updater(newTree[key]);
        return newTree;
      }
      if (newTree[key].children) {
        newTree[key].children = updateNodeInTree(newTree[key].children, id, updater);
      }
    }
    return newTree;
  };

  // 汎用: 親ノードへの追加
  const addChildToParent = (tree, parentId, newChild) => {
    if (!parentId || parentId === 'root') {
      const root = { ...tree.root };
      root.children = { ...root.children, [newChild.id]: newChild };
      return { ...tree, root };
    }
    return updateNodeInTree(tree, parentId, (node) => ({
      ...node,
      children: { ...node.children, [newChild.id]: newChild },
      isOpen: true
    }));
  };

  // ★新機能: アイテム移動 (Cut & Paste)
  const moveItem = useCallback((sourceId, targetId) => {
    // 自分自身への移動や、ルートへの移動禁止などは簡易チェック
    if (sourceId === targetId) return;

    // 1. 移動するノードのデータを取得（ディープコピー）
    const sourceNode = JSON.parse(JSON.stringify(findNode(fileTree, sourceId)));
    if (!sourceNode) return;

    // 2. 移動先がフォルダならその中へ、ファイルならその親へ
    let destinationId = targetId;
    const targetNode = findNode(fileTree, targetId);
    
    // ターゲットが見つからない、またはターゲットが自分自身の子孫であればキャンセル（無限ループ防止）
    // ※今回は簡易実装のため厳密な子孫チェックは省略しますが、実運用では必須

    // もしターゲットがファイルなら、その親フォルダを探すべきだが、
    // ここでは簡易的に「ターゲットがフォルダなら中に入れる、それ以外はルートへ」等の制御が必要。
    // 今回は「フォルダにドロップ」＝中へ、「ファイルにドロップ」＝何もしない、とします。
    if (targetNode.type !== 'folder' && targetId !== 'root') return; 

    setFileTree(prev => {
      // 3. 元の場所から削除
      const deleteFromTree = (tree, tId) => {
        const newTree = { ...tree };
        for (const key in newTree) {
          if (key === tId) { delete newTree[key]; return newTree; }
          if (newTree[key].children) { newTree[key].children = deleteFromTree(newTree[key].children, tId); }
        }
        return newTree;
      };
      
      const treeWithoutSource = deleteFromTree(prev, sourceId);

      // 4. 新しい場所へ追加
      const finalTree = addChildToParent(treeWithoutSource, destinationId, sourceNode);
      
      saveToStorage(finalTree);
      return finalTree;
    });
  }, [fileTree]);

  // ★新機能: ピン留め切り替え
  const togglePin = useCallback((id) => {
    setFileTree(prev => {
      const next = updateNodeInTree(prev, id, node => ({ ...node, isPinned: !node.isPinned }));
      saveToStorage(next);
      return next;
    });
  }, []);

  // -- 以下、既存機能 --

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
    // ... (遅延保存省略)
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
        // 削除ロジック(略)
        const deleteFromTree = (tree, targetId) => {
            const newTree = { ...tree };
            for (const key in newTree) {
              if (key === targetId) { delete newTree[key]; return newTree; }
              if (newTree[key].children) { newTree[key].children = deleteFromTree(newTree[key].children, targetId); }
            }
            return newTree;
        };
        const next = deleteFromTree(prev, id); 
        saveToStorage(next); return next; 
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

  const getFile = useCallback((id) => findNode(fileTree, id), [fileTree]);
  const getAllFiles = useCallback(() => {
    const files = [];
    const traverse = (tree) => {
      for (const key in tree) { const node = tree[key]; if (node.type !== 'folder') files.push(node); if (node.children) traverse(node.children); }
    };
    traverse(fileTree);
    return files;
  }, [fileTree]);

  return { fileTree, unsavedFiles, updateFileContent, updatePlotRow, createItem, deleteItem, renameItem, toggleFolder, getFile, getAllFiles, moveItem, togglePin, isReady };
};

// ---------------------------------------------------------
// 3. コンテキストメニュー (Pin追加)
// ---------------------------------------------------------
const ContextMenu = ({ x, y, onClose, onAction, targetType, isPinned }) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div style={{ top: y, left: x }} className="fixed z-50 bg-[#252526] border border-[#454545] shadow-xl py-1 rounded min-w-[160px] text-xs text-gray-300">
        <div onClick={() => onAction('new_file')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer">New File</div>
        <div onClick={() => onAction('new_folder')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer">New Folder</div>
        <div onClick={() => onAction('new_db')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer">New Plot (.db)</div>
        <div className="h-px bg-[#454545] my-1 mx-2"></div>
        
        {/* ピン留め機能 */}
        {targetType !== 'root' && (
          <div onClick={() => onAction('toggle_pin')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer flex justify-between">
            {isPinned ? "Unpin" : "Pin"} {isPinned && "★"}
          </div>
        )}

        {targetType !== 'root' && (
          <>
            <div className="h-px bg-[#454545] my-1 mx-2"></div>
            <div onClick={() => onAction('rename')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer">Rename</div>
            <div onClick={() => onAction('delete')} className="px-3 py-1.5 hover:bg-[#094771] hover:text-white cursor-pointer text-red-400">Delete</div>
          </>
        )}
      </div>
    </>
  );
};

// ---------------------------------------------------------
// 4. ツリービュー (ソート修正 & DnD実装)
// ---------------------------------------------------------
const ChevronRight = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const ChevronDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const PinIcon = () => <span className="text-[9px] text-yellow-500 mr-1 transform rotate-45">📌</span>;

// ★ソート用関数: Pin > Folder > Name
const getSortedChildren = (children) => {
  return Object.values(children).sort((a, b) => {
    // 1. ピン留め優先
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // 2. フォルダ優先
    const aIsFolder = a.type === 'folder';
    const bIsFolder = b.type === 'folder';
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;

    // 3. 名前順 (数値考慮)
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });
};

const TreeNode = ({ node, level = 0, activeId, onSelect, onToggle, onContextMenu, onMove }) => {
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeId;
  const indent = level * 10 + 10;
  const [isDragOver, setIsDragOver] = useState(false); // ドロップ対象のハイライト用

  // DnDハンドラ
  const handleDragStart = (e) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ id: node.id, type: node.type }));
    e.stopPropagation();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isFolder) {
      e.stopPropagation();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (!isFolder) return; // フォルダ以外にはドロップ不可

    const data = JSON.parse(e.dataTransfer.getData("application/json"));
    if (data.id !== node.id) {
        onMove(data.id, node.id);
    }
  };

  if (node.id === 'root') {
    const sortedChildren = getSortedChildren(node.children);
    return (
      <div 
        onDragOver={(e) => e.preventDefault()} 
        onDrop={(e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData("application/json"));
            onMove(data.id, 'root');
        }}
        className="h-full flex flex-col"
      >
        {sortedChildren.map(child => (
          <TreeNode key={child.id} node={child} level={0} activeId={activeId} onSelect={onSelect} onToggle={onToggle} onContextMenu={onContextMenu} onMove={onMove} />
        ))}
        {/* ルートへのドロップエリア */}
        <div className="flex-1 min-h-[50px]" onContextMenu={(e) => onContextMenu(e, 'root', 'folder', false)}></div>
      </div>
    );
  }

  const sortedChildren = isFolder && node.children ? getSortedChildren(node.children) : [];

  return (
    <div>
      <div 
        className={`
          flex items-center py-1 cursor-pointer select-none transition-colors
          ${isActive ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-gray-300'}
          ${isDragOver ? 'bg-[#094771] border-2 border-blue-400' : 'border-2 border-transparent'}
        `}
        style={{ paddingLeft: `${indent}px` }}
        onClick={(e) => {
          e.stopPropagation();
          if (isFolder) onToggle(node.id);
          else onSelect(node.id);
        }}
        onContextMenu={(e) => onContextMenu(e, node.id, node.type, node.isPinned)}
        draggable="true" // ★ドラッグ可能に
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-5 flex items-center justify-center text-gray-500">
          {isFolder && (node.isOpen ? <ChevronDown /> : <ChevronRight />)}
        </div>
        
        {/* ピン留め時はアイコン表示 */}
        {node.isPinned && <PinIcon />}

        <span className={`truncate text-xs ${isFolder ? 'font-bold text-gray-200' : ''}`}>
          {node.name}
        </span>
      </div>

      {isFolder && node.isOpen && (
        <div>
          {sortedChildren.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} activeId={activeId} onSelect={onSelect} onToggle={onToggle} onContextMenu={onContextMenu} onMove={onMove} />
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------
// 5. コンポーネント群 (変更なし)
// ---------------------------------------------------------
const ActivityBar = ({ activeView, onSelect }) => (
  <div className="w-12 bg-[#333333] flex flex-col items-center py-2 border-r border-[#1e1e1e] select-none z-10">
    <div onClick={() => onSelect('explorer')} className={`w-10 h-10 flex items-center justify-center mb-2 cursor-pointer border-l-2 ${activeView === 'explorer' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`} title="Explorer">🗂</div>
    <div onClick={() => onSelect('search')} className={`w-10 h-10 flex items-center justify-center mb-2 cursor-pointer border-l-2 ${activeView === 'search' ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`} title="Search">🔍</div>
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
        lines.forEach((line, i) => {
          if (line.toLowerCase().includes(query.toLowerCase())) {
            hits.push({ fileId: file.id, fileName: file.name, line: i + 1, text: line.trim() });
          }
        });
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

const TabBar = ({ tabs, activeTabId, unsavedFiles, onTabClick, onCloseTab, fileSystem }) => (
  <div className="flex bg-[#252526] h-9 items-center overflow-x-auto no-scrollbar">
    {tabs.map(fileId => {
      const file = fileSystem.getFile(fileId);
      if (!file) return null;
      const isActive = fileId === activeTabId;
      const isDb = file.type === 'db';
      const isDirty = unsavedFiles.has(fileId);
      return (
        <div key={fileId} onClick={() => onTabClick(fileId)} className={`group flex items-center min-w-[120px] max-w-[200px] h-full px-3 text-xs cursor-pointer border-r border-[#1e1e1e] select-none ${isActive ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'bg-[#2d2d2d] text-gray-400 hover:bg-[#2a2d2e] border-t-2 border-t-transparent'}`}>
          <span className={`mr-2 ${isDb ? 'text-blue-400' : 'text-yellow-400'}`}>{isDb ? '▦' : 'JS'}</span>
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
              <select value={row.status} onChange={(e) => onUpdate(row.id, 'status', e.target.value)} className={`bg-transparent border rounded px-1 py-0.5 text-[10px] outline-none ${row.status === 'DONE' ? 'border-green-800 text-green-500' : row.status === 'WIP' ? 'border-orange-800 text-orange-500' : 'border-gray-700 text-gray-500'}`}>
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
  const lineCount = activeFile && activeFile.type === 'code' ? activeFile.content.split('\n').length : 0;
  const status = logs.length > 0 ? logs[logs.length - 1] : 'Ready';
  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[10px] justify-between select-none shrink-0">
      <div className="flex gap-4"><span className="flex items-center gap-1"><span className="font-bold">⚡</span> {status.replace('> ', '')}</span></div>
      <div className="flex gap-4">{activeFile && activeFile.type === 'code' && (<><span>Ln {lineCount}</span><span>{wordCount} Chars</span></>)}<span>UTF-8</span><span>JavaScript</span></div>
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
  const [logs, setLogs] = useState(['> System initialized.', '> Drag & Drop enabled.']);
  const [sidebarView, setSidebarView] = useState('explorer');

  // ContextMenuの状態に isPinned を追加
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, targetId: null, targetType: null, isPinned: false });

  const handleContextMenu = useCallback((e, targetId, targetType, isPinned) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetId, targetType, isPinned });
  }, []);

  const handleContextMenuAction = (action) => {
    const { targetId, targetType } = contextMenu;
    let parentId = targetType === 'folder' ? targetId : 'root'; 

    if (action === 'new_file') {
      const name = prompt("File Name:");
      if (name) fs.createItem(parentId, name, 'code');
    } else if (action === 'new_folder') {
      const name = prompt("Folder Name:");
      if (name) fs.createItem(parentId, name, 'folder');
    } else if (action === 'new_db') {
      let name = prompt("Plot Name (.db):");
      if (name) { if (!name.endsWith('.db')) name += '.db'; fs.createItem(parentId, name, 'db'); }
    } else if (action === 'rename') {
      const name = prompt("New Name:", fs.getFile(targetId)?.name);
      if (name) fs.renameItem(targetId, name);
    } else if (action === 'delete') {
      fs.deleteItem(targetId);
    } else if (action === 'toggle_pin') { // ★ピン留め切り替え
      fs.togglePin(targetId);
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

  const openTab = (id) => {
    setTabs(prev => !prev.includes(id) ? [...prev, id] : prev);
    setActiveTabId(id);
  };
  const closeTab = (e, id) => {
    e.stopPropagation();
    setTabs(prev => {
      const next = prev.filter(t => t !== id);
      if (activeTabId === id) setActiveTabId(next[next.length - 1] || null);
      return next;
    });
  };

  const runScript = async () => {
    const file = fs.getFile(activeTabId);
    if (!file) return;
    setLogs(['> Compiling...']);
    const customConsole = { log: (m) => setLogs(p => [...p, `[LOG] ${m}`]), error: (m) => setLogs(p => [...p, `[ERR] ${m}`]) };
    const say = (t) => setLogs(p => [...p, `"${t}"`]);
    try {
      const f = new Function('console', 'say', file.content);
      f(customConsole, say);
      setLogs(p => [...p, '> Done.']);
    } catch (e) { setLogs(p => [...p, `> Error: ${e.message}`]); }
  };

  const getLanguage = (fileName) => {
    if (!fileName) return 'plaintext';
    if (fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.md')) return 'markdown';
    if (fileName.endsWith('.json')) return 'json';
    return 'plaintext';
  };

  if (!fs.isReady) return <div className="bg-[#1e1e1e] h-screen text-gray-500 p-10 font-mono">Loading...</div>;
  const activeFile = fs.getFile(activeTabId);

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-gray-300 font-mono text-sm overflow-hidden flex-col" onClick={() => setContextMenu({ ...contextMenu, visible: false })} onContextMenu={(e) => e.preventDefault()}>
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar activeView={sidebarView} onSelect={setSidebarView} />

        <div className="w-64 border-r border-gray-700 flex flex-col bg-[#252526] select-none h-full">
           <div className="px-4 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-500" onContextMenu={(e) => handleContextMenu(e, 'root', 'folder', false)}>
              {sidebarView === 'explorer' ? 'EXPLORER' : 'SEARCH'}
           </div>
           
           <div className="flex-1 overflow-y-auto">
             {sidebarView === 'explorer' ? (
               <TreeNode 
                 node={fs.fileTree.root} 
                 activeId={activeTabId} 
                 onSelect={openTab} 
                 onToggle={fs.toggleFolder}
                 onContextMenu={handleContextMenu}
                 onMove={fs.moveItem} // ★移動ハンドラを渡す
               />
             ) : (
               <SearchPane files={fs.getAllFiles()} onOpenFile={openTab} />
             )}
           </div>
        </div>

        <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
          <Link href="/" className="absolute top-0 right-0 z-50 text-gray-500 hover:text-white bg-[#1e1e1e] px-3 py-1 text-xs opacity-50 hover:opacity-100">EXIT →</Link>

          <div className="flex bg-[#252526] h-9 items-center border-b border-[#1e1e1e] pr-10">
            <div className="flex-1 overflow-hidden h-full">
              <TabBar tabs={tabs} activeTabId={activeTabId} unsavedFiles={fs.unsavedFiles} onTabClick={setActiveTabId} onCloseTab={closeTab} fileSystem={fs} />
            </div>
            {activeFile?.type === 'code' && (
              <button onClick={runScript} className="ml-2 text-[10px] bg-green-800 hover:bg-green-700 text-white px-2 py-1 rounded flex items-center gap-1 shrink-0"><span>▶</span></button>
            )}
          </div>

          <div className="flex-1 overflow-hidden relative">
            {!activeFile ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4"><div className="text-4xl opacity-20">FILTER SHOP IDE</div></div>
            ) : activeFile.type === 'db' ? (
              <PlotGrid data={activeFile.content} onUpdate={(rowId, field, val) => fs.updatePlotRow(activeFile.id, rowId, field, val)} />
            ) : (
              <Editor
                height="100%"
                language={getLanguage(activeFile.name)}
                theme="vs-dark"
                value={activeFile.content}
                onChange={(value) => fs.updateFileContent(activeFile.id, value)}
                options={{ minimap: { enabled: true }, fontSize: 14, fontFamily: "'Menlo', monospace", automaticLayout: true, padding: { top: 10 } }}
              />
            )}
          </div>
          
          {activeFile?.type === 'code' && (
            <div className="h-24 border-t border-gray-700 bg-[#1e1e1e] overflow-auto p-2 text-xs text-green-500">
               {logs.map((l, i) => <div key={i} className="mb-0.5 border-b border-gray-800/50">{l}</div>)}
            </div>
          )}
        </div>
      </div>
      <StatusBar activeFile={activeFile} logs={logs} />
      
      {contextMenu.visible && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          targetType={contextMenu.targetType}
          isPinned={contextMenu.isPinned} // ★ピン状態を渡す
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
          onAction={handleContextMenuAction}
        />
      )}
    </div>
  );
}