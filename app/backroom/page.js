"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function BackRoom() {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  // ページを開いたら自動で入力欄にフォーカス
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // ★ここでパスワードを設定（とりあえず '0000'）
    if (input === "0000") {
      setUnlocked(true);
    } else {
      setError(true);
      setInput(""); // 入力をリセット
      setTimeout(() => setError(false), 1000); // 1秒後にエラー表示を消す
    }
  };

  // --- 鍵が開いた後の世界（個人の棚） ---
  if (unlocked) {
    return (
      <main style={{ backgroundColor: "#111", minHeight: "100vh", padding: "40px", color: "#fff", fontFamily: "monospace" }}>
        <h1 style={{ borderBottom: "1px solid #333", paddingBottom: "10px", marginBottom: "30px" }}>
          ARCHIVE: PRIVATE LOGS
        </h1>
        
        {/* 秘密のモニター（ここにも好きな動画を置けます） */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            <div style={{ background: "#222", padding: "20px", borderRadius: "10px" }}>
                <p style={{ color: "#888", fontSize: "12px", marginBottom: "10px" }}>2024-12-25_recording.mp4</p>
                <div style={{ aspectRatio: "16/9", background: "#000" }}>
                    {/* ここに限定公開のYoutubeなどを貼る */}
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}>
                        NO SIGNAL
                    </div>
                </div>
            </div>
            {/* テキストだけの記録 */}
            <div style={{ background: "#222", padding: "20px", borderRadius: "10px" }}>
                <p style={{ color: "#d00", fontSize: "12px", marginBottom: "10px" }}>MEMO.txt</p>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#ccc" }}>
                    開発ログ。<br/>
                    モニターの同期システムのバグ修正。<br/>
                    次の構想：地下2階のサイバーシティを作る。
                </p>
            </div>
        </div>

        <Link href="/">
          <div style={{ marginTop: "50px", color: "#666", cursor: "pointer" }}>&lt; RETURN TO HALL</div>
        </Link>
      </main>
    );
  }

  // --- 鍵がかかっている状態（パスワード入力画面） ---
  return (
    <main style={{ backgroundColor: "#000", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#fff", fontFamily: "monospace" }}
          onClick={() => inputRef.current?.focus()} // どこをクリックしても入力できるように
    >
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        <div style={{ marginBottom: "20px", color: error ? "red" : "#666" }}>
            {error ? "ACCESS DENIED" : "SECURITY CHECK"}
        </div>
        
        <form onSubmit={handleLogin} style={{ display: "flex", fontSize: "24px" }}>
          <span style={{ marginRight: "10px", color: "#0f0" }}>&gt;</span>
          <input
            ref={inputRef}
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ 
                background: "transparent", 
                border: "none", 
                color: "#fff", 
                outline: "none", 
                fontSize: "24px", 
                fontFamily: "monospace",
                width: "100%"
            }}
            autoFocus
          />
          {/* カーソルの点滅アニメーション */}
          <style jsx>{`
            @keyframes blink { 50% { opacity: 0; } }
            input::after { content: "█"; animation: blink 1s step-end infinite; }
          `}</style>
        </form>
        
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#444" }}>
            ENTER PASSWORD AND PRESS RETURN
        </div>
      </div>
      
      <Link href="/">
        <div style={{ position: "fixed", bottom: "30px", fontSize: "12px", color: "#333", cursor: "pointer" }}>
            [ CANCEL ]
        </div>
      </Link>
    </main>
  );
}