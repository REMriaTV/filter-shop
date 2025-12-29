'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import Link from 'next/link';

export default function AdminRoom() {
  const [logs, setLogs] = useState([
    '> System initialized.', 
    '> Access granted: Administrator.',
    '> Loading Novel Module...',
    '> Ready to write.'
  ]);

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-gray-300 font-mono text-sm overflow-hidden">
      {/* 戻るボタン（左上） */}
      <Link href="/" className="absolute top-2 left-2 z-50 text-gray-500 hover:text-white bg-[#1e1e1e] px-2 border border-gray-700">
        ← EXIT
      </Link>

      {/* 左サイドバー */}
      <div className="w-64 border-r border-gray-700 flex flex-col bg-[#252526]">
        <div className="p-3 mt-8 text-xs font-bold uppercase tracking-wider text-gray-500">EXPLORER: NOVEL</div>
        <div className="flex-1 overflow-y-auto">
           {['prologue.txt', 'chapter_01.txt', 'ideas/', 'characters/'].map((item, i) => (
            <div key={i} className="px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer flex items-center text-gray-300">
              <span className="mr-2 opacity-70">{item.endsWith('/') ? '📁' : '📄'}</span>
              {item}
            </div>
           ))}
        </div>
      </div>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col relative">
        {/* タブ */}
        <div className="flex bg-[#2d2d2d] h-9 items-center border-b border-[#1e1e1e]">
          <div className="px-4 h-full bg-[#1e1e1e] border-t-2 border-blue-500 text-white flex items-center min-w-[120px]">
            <span className="text-yellow-400 mr-2 text-xs">JS</span>
            <span>chapter_01.txt</span>
          </div>
        </div>

        {/* エディタ (Monaco) */}
        <div className="flex-1">
           <Editor
             height="100%"
             defaultLanguage="javascript" // あえてJSモードでハイライトさせる
             theme="vs-dark"
             defaultValue={`// 
// 隠し部屋へようこそ。
// ここは管理人の思考実験場。
//

const title = "雨の日のアンドロイド";

function Scene1() {
    // 描写
    const weather = "heavy rain";
    const emotion = null;

    console.log("彼は濡れたコートを脱がずに座った。");
    
    // 台詞
    say("……遅かったじゃないか");
}
`}
             options={{
               minimap: { enabled: true },
               fontSize: 14,
               fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
               lineNumbers: 'on',
               scrollBeyondLastLine: false,
               automaticLayout: true,
             }}
           />
        </div>

        {/* 下部ターミナル */}
        <div className="h-32 border-t border-gray-700 bg-[#1e1e1e] flex flex-col">
          <div className="flex text-xs uppercase border-b border-gray-700 bg-[#2d2d2d] text-gray-400">
            <div className="px-4 py-1 border-b border-gray-500 text-white">TERMINAL</div>
            <div className="px-4 py-1">OUTPUT</div>
          </div>
          <div className="p-2 overflow-y-auto h-full font-mono text-xs text-green-500">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 opacity-80">{log}</div>
            ))}
            <div className="animate-pulse">_</div>
          </div>
        </div>
      </div>
    </div>
  );
}