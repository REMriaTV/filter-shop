// app/page.js
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

// --- 1. 個別のモニターコンポーネント ---
const Monitor = ({ videoId, index }) => {
  const [isClient, setIsClient] = useState(false);
  const [config, setConfig] = useState({ 
    startTime: 0, 
    delay: 0,
    origin: "" 
  });

  useEffect(() => {
    setIsClient(true);
    setConfig({
      // 再生開始位置をズラす（0〜600秒）
      startTime: Math.floor(Math.random() * 600),
      
      // ★修正箇所：時間差の上限を「24秒」に変更しました
      delay: Math.random() * 24,
      
      origin: window.location.origin
    });
  }, []);

  if (!isClient) return <div style={styles.monitorFrame} />;

  return (
    // モニター枠は最初から表示
    <div style={styles.monitorFrame}>
      <div style={styles.screen}>
        {config.origin && (
          <iframe
            width="100%"
            height="100%"
            // 開始位置をズラす
            src={`https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=${videoId}&start=${config.startTime}&origin=${config.origin}`}
            title={`Monitor-${index}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ 
              pointerEvents: "auto",
              // 中身（映像）だけが遅れてつく
              opacity: 0, 
              animation: `screenOn 0.2s ease-out forwards`, 
              animationDelay: `${config.delay}s` 
            }}
          />
        )}
        {/* 走査線は常に表示 */}
        <div style={styles.scanline}></div>
      </div>
      
      {/* ランプも遅れて点灯 */}
      <div style={{ marginTop: "5px", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444" }}>
        <span>SONY</span>
        <span 
          style={{ 
            width: "6px", 
            height: "6px", 
            background: "#d00", 
            borderRadius: "50%", 
            boxShadow: "0 0 6px #f00",
            opacity: 0,
            animation: `lampOn 0.1s ease-out forwards`,
            animationDelay: `${config.delay}s`
          }}
        ></span>
      </div>
    </div>
  );
};

// --- 2. メインページ ---
export default function Home() {
  const rawVideoIds = [
    "L_LUpnjgPso", // 暖炉
    "L_LUpnjgPso",
    "L_LUpnjgPso",
    "L_LUpnjgPso",
    "q76bMs-NwRk", // 雨音と暖炉
    "q76bMs-NwRk",
    "q76bMs-NwRk",
    "q76bMs-NwRk",
    "jn4lNAfwD0g", // ダイビング
    "jn4lNAfwD0g",
    "jn4lNAfwD0g",
    "jn4lNAfwD0g",
  ];

  const [shuffledList, setShuffledList] = useState([]);

  useEffect(() => {
    // ランダム配置のロジック
    const list = [...rawVideoIds].sort(() => Math.random() - 0.5);
    setShuffledList(list);
  }, []);

  return (
    <main style={{ backgroundColor: "#111", minHeight: "100vh", padding: "20px", color: "#fff" }}>
      <style jsx global>{`
        /* 画面がピカッとつく演出 */
        @keyframes screenOn {
          0% { opacity: 0; filter: brightness(0); }
          50% { opacity: 1; filter: brightness(2); }
          100% { opacity: 1; filter: brightness(1); }
        }
        /* ランプ点灯 */
        @keyframes lampOn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* タイトル */}
      <h1 style={{ textAlign: "center", fontFamily: "monospace", opacity: 0.5, marginBottom: "40px" }}>Filter</h1>
      
      {/* モニターの壁 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {shuffledList.map((id, index) => (
          <Monitor key={`${id}-${index}`} videoId={id} index={index} />
        ))}
      </div>

      <Link href="/shop">
        <div style={{ position: "fixed", bottom: "20px", right: "20px", cursor: "pointer", zIndex: 100 }}>
          <div style={{ border: "1px solid #555", padding: "10px", background: "#000", fontFamily: "serif", color: "#fff" }}>
            売店 <br/><span style={{fontSize: "0.8rem"}}>Kiosk -&gt;</span>
          </div>
        </div>
      </Link>
    </main>
  );
}

// --- 3. スタイル定義 ---
const styles = {
  monitorFrame: {
    width: "300px",
    height: "240px",
    background: "#222",
    borderRadius: "20px",
    padding: "15px",
    boxShadow: "0 0 20px rgba(0,0,0,0.8), inset 0 0 10px #000",
    border: "2px solid #333",
    position: "relative",
  },
  screen: {
    width: "100%",
    height: "180px",
    background: "#000",
    borderRadius: "40% 40% 40% 40% / 10% 10% 10% 10%",
    overflow: "hidden",
    position: "relative",
    boxShadow: "inset 0 0 20px rgba(0,0,0,1)",
    border: "1px solid #444",
  },
  scanline: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
    backgroundSize: "100% 2px, 3px 100%",
    pointerEvents: "none",
    zIndex: 10,
  }
};