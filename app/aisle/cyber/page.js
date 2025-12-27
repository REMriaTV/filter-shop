"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

// --- モニターコンポーネント ---
const Monitor = ({ videoId, index }) => {
  const [isClient, setIsClient] = useState(false);
  const [config, setConfig] = useState({ startTime: 0, delay: 0, origin: "" });

  useEffect(() => {
    setIsClient(true);
    setConfig({
      startTime: Math.floor(Math.random() * 600),
      delay: Math.random() * 12,
      origin: window.location.origin
    });
  }, []);

  if (!isClient) return <div style={styles.monitorFrame} />;

  return (
    <div style={styles.monitorFrame} className="mobile-monitor">
      <div style={styles.screen} className="mobile-screen">
        {config.origin && (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=${videoId}&start=${config.startTime}&origin=${config.origin}&playsinline=1`}
            title={`Monitor-${index}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: "auto", opacity: 0, animation: `screenOn 0.2s ease-out forwards`, animationDelay: `${config.delay}s` }}
          />
        )}
        <div style={styles.scanline}></div>
      </div>
      
      {/* ラベルを SYSTEM に変更、ランプを青色(#0ff)に変更 */}
      <div className="monitor-label" style={{ marginTop: "5px", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444" }}>
        <span style={{ fontFamily: "monospace", letterSpacing: "1px" }}>SYSTEM</span> 
        <span style={{ width: "6px", height: "6px", background: "#0ff", borderRadius: "50%", boxShadow: "0 0 6px #0ff", opacity: 0, animation: `lampOn 0.1s ease-out forwards`, animationDelay: `${config.delay}s` }}></span>
      </div>
    </div>
  );
};

// --- B2: CYBER CITY FLOOR ---
export default function CyberAisle() {
  // ★電脳・都市系の動画リスト
  const cyberVideoIds = [
    "5wRM7c9uJ2Q", // サイバーパンクシティの雨
    "Ptk_1Dc2iPY", // 深夜のコーディング（キーボード音）
    "S_0ikBGO7O0", // 未来的な部屋
    "b8tC0hD6N14", // 夜の東京モノレール（ゆりかもめ）
    "tNkZsRW7h2c", // 宇宙船内の環境音
    "7M0_q2q8G7g", // 日本のコンビニ夜景
    "5wRM7c9uJ2Q", // (数増し)
    "Ptk_1Dc2iPY", // (数増し)
  ];

  const [shuffledList, setShuffledList] = useState([]);

  useEffect(() => {
    const list = [...cyberVideoIds, ...cyberVideoIds].slice(0, 12).sort(() => Math.random() - 0.5);
    setShuffledList(list);
  }, []);

  return (
    <main style={{ backgroundColor: "#050510", minHeight: "100vh", padding: "20px", color: "#fff" }}>
      <style jsx global>{`
        @keyframes screenOn { 0% { opacity: 0; filter: brightness(0); } 50% { opacity: 1; filter: brightness(2); } 100% { opacity: 1; filter: brightness(1); } }
        @keyframes lampOn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 768px) {
          .monitor-container { gap: 8px !important; }
          .mobile-monitor { width: 48% !important; padding: 8px !important; border-radius: 10px !important; aspect-ratio: 5/4 !important; height: auto !important; }
          .mobile-screen { height: 75% !important; border-radius: 4px !important; }
          .monitor-label { margin-top: 4px !important; font-size: 9px !important; }
        }
      `}</style>

      {/* 少し青みがかったタイトルの色 */}
      <h1 style={{ textAlign: "center", fontFamily: "monospace", opacity: 0.5, marginBottom: "40px", color: "#aaddff", textShadow: "0 0 10px #0055ff" }}>Filter / CYBER</h1>
      
      <div className="monitor-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {shuffledList.map((id, index) => (
          <Monitor key={`${id}-${index}`} videoId={id} index={index} />
        ))}
      </div>

      {/* フロアガイド（B2にいる表示） */}
      <div style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 100, fontFamily: "monospace", fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
        <div style={{ marginBottom: "5px", borderBottom: "1px solid #333", paddingBottom: "2px" }}>FLOOR GUIDE</div>
        
        <Link href="/">
          <div style={{ opacity: 0.5, cursor: "pointer" }}>1F : MAIN HALL</div>
        </Link>
        
        <Link href="/aisle/nature">
          <div style={{ opacity: 0.5, cursor: "pointer" }}>B1 : NATURE</div>
        </Link>
        
        {/* 現在地 */}
        <div style={{ color: "#0ff", textShadow: "0 0 5px #0ff" }}>B2 : CYBER CITY &lt;</div>
        
        <Link href="/backroom">
          <div style={{ marginTop: "8px", opacity: 0.3, cursor: "pointer" }}>B9 : STAFF ONLY [LOCK]</div>
        </Link>
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

const styles = {
  monitorFrame: { width: "300px", height: "240px", background: "#1a1a20", borderRadius: "20px", padding: "15px", boxShadow: "0 0 20px rgba(0,0,0,0.8), inset 0 0 10px #000", border: "2px solid #223344", position: "relative" },
  screen: { width: "100%", height: "180px", background: "#000", borderRadius: "40% 40% 40% 40% / 10% 10% 10% 10%", overflow: "hidden", position: "relative", boxShadow: "inset 0 0 20px rgba(0,0,0,1)", border: "1px solid #334455" },
  scanline: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))", backgroundSize: "100% 2px, 3px 100%", pointerEvents: "none", zIndex: 10 }
};