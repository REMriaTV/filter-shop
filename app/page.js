// app/page.js
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

// --- 1. 個別のモニターコンポーネント（変更なし） ---
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
            style={{ 
              pointerEvents: "auto",
              opacity: 0, 
              animation: `screenOn 0.2s ease-out forwards`, 
              animationDelay: `${config.delay}s` 
            }}
          />
        )}
        <div style={styles.scanline}></div>
      </div>
      
      <div className="monitor-label" style={{ marginTop: "5px", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444" }}>
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
    "L_LUpnjgPso", "L_LUpnjgPso", "L_LUpnjgPso", "L_LUpnjgPso",
    "q76bMs-NwRk", "q76bMs-NwRk", "q76bMs-NwRk", "q76bMs-NwRk",
    "jn4lNAfwD0g", "jn4lNAfwD0g", "jn4lNAfwD0g", "jn4lNAfwD0g",
  ];

  const [shuffledList, setShuffledList] = useState([]);

  useEffect(() => {
    const list = [...rawVideoIds].sort(() => Math.random() - 0.5);
    setShuffledList(list);
  }, []);

  return (
    // ★修正1：背景色を #111 から #000 に変更
    <main style={{ backgroundColor: "#000", minHeight: "100vh", padding: "20px", color: "#fff" }}>
      <style jsx global>{`
        @keyframes screenOn {
          0% { opacity: 0; filter: brightness(0); }
          50% { opacity: 1; filter: brightness(2); }
          100% { opacity: 1; filter: brightness(1); }
        }
        @keyframes lampOn { from { opacity: 0; } to { opacity: 1; } }

        /* ★修正2：モバイルレイアウトの修正を適用 */
        @media (max-width: 768px) {
          .monitor-container { 
            gap: 10px !important; 
          }
          .mobile-monitor {
            /* 48%だと崩れるため46%に変更 */
            width: 46% !important; 
            padding: 8px !important; 
            border-radius: 10px !important; 
            aspect-ratio: 4/3; /* アスペクト比修正 */
            height: auto !important;
          }
          .mobile-screen { 
            /* 高さ固定を解除し、比率で制御 */
            height: auto !important; 
            aspect-ratio: 16/11 !important;
            width: 100% !important;
            border-radius: 4px !important; 
          }
          .monitor-label { 
            margin-top: 4px !important; 
            font-size: 9px !important; 
          }
        }
      `}</style>

      <h1 style={{ textAlign: "center", fontFamily: "monospace", opacity: 0.5, marginBottom: "40px" }}>Filter</h1>
      
      <div className="monitor-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {shuffledList.map((id, index) => (
          <Monitor key={`${id}-${index}`} videoId={id} index={index} />
        ))}
      </div>

      {/* 左下のフロアガイド（最新コードのリンク構造を維持） */}
      <div style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 100, fontFamily: "monospace", fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
        <div style={{ marginBottom: "5px", borderBottom: "1px solid #333", paddingBottom: "2px" }}>FLOOR GUIDE</div>
        <div style={{ color: "#fff" }}>1F : MAIN HALL &lt;</div>
        
        <Link href="/aisle/nature">
          <div style={{ opacity: 0.5, cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={(e) => e.target.style.opacity = 1} onMouseOut={(e) => e.target.style.opacity = 0.5}>
            B1 : NATURE
          </div>
        </Link>
        
        <Link href="/aisle/cyber">
          <div style={{ opacity: 0.5, cursor: "pointer", transition: "opacity 0.2s" }} onMouseOver={(e) => e.target.style.opacity = 1} onMouseOut={(e) => e.target.style.opacity = 0.5}>
            B2 : CYBER CITY
          </div>
        </Link>

        <Link href="/backroom">
          <div style={{ marginTop: "8px", opacity: 0.3, cursor: "pointer", transition: "opacity 0.2s" }} 
               onMouseOver={(e) => e.target.style.opacity = 1} 
               onMouseOut={(e) => e.target.style.opacity = 0.3}>
            B9 : STAFF ONLY [LOCK]
          </div>
        </Link>
      </div>

      {/* 右下の売店（変更なし） */}
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

// --- 3. スタイル定義（変更なし） ---
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