"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // ★復活

// --- モニターコンポーネント ---
const Monitor = ({ index, floorData }) => {
  const router = useRouter();
  const [config, setConfig] = useState({ startTime: 0, delay: 0, origin: "" });

  useEffect(() => {
    setConfig({
      startTime: Math.floor(Math.random() * 600),
      delay: Math.random() * 12,
      origin: window.location.origin
    });
  }, []);

  const handleClick = () => {
    if (floorData.type === 'link') {
      router.push(floorData.path);
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        ...styles.monitorFrame,
        cursor: floorData.type === 'link' ? 'pointer' : 'default'
      }}
      className="mobile-monitor"
    >
      <div style={styles.screen} className="mobile-screen">
        {/* リンクあり（映像） */}
        {floorData.type === 'link' && config.origin && (
          <iframe
            width="100%" height="100%"
            src={`https://www.youtube.com/embed/${floorData.videoId}?controls=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=${floorData.videoId}&start=${config.startTime}&origin=${config.origin}&playsinline=1`}
            frameBorder="0"
            style={{ pointerEvents: "none", opacity: 0, animation: `screenOn 0.2s ease-out forwards`, animationDelay: `${config.delay}s` }}
          />
        )}
        
        {/* 空室（テキスト） */}
        {floorData.type === 'empty' && (
           <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: "10px", fontFamily: "monospace", flexDirection: "column", opacity: 0, animation: `screenOn 0.2s ease-out forwards`, animationDelay: `${config.delay}s` }}>
             <span>NO SIGNAL</span>
             <span style={{ marginTop: "5px", color: "#555" }}>{floorData.text}</span>
           </div>
        )}
        <div style={styles.scanline}></div>
      </div>
      
      {/* ラベルとランプ */}
      <div className="monitor-label" style={{ marginTop: "5px", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444" }}>
        {/* エレベーターなので番号表記にしましたが、SONYに戻したければここを変えてください */}
        <span>No.{String(index).padStart(2, '0')}</span>
        <span style={{ 
          width: "6px", height: "6px", 
          background: floorData.type === 'link' ? "#d00" : "#333", 
          borderRadius: "50%", 
          boxShadow: floorData.type === 'link' ? "0 0 6px #f00" : "none",
          transition: "background 0.3s"
        }}></span>
      </div>
    </div>
  );
};

// --- 受付メイン ---
export default function Reception() {
  
  const getMonitorData = (i) => {
    const index = i + 1;
    // B1: Ocean
    if (index === 1) return { type: 'link', path: '/floor/ocean', videoId: 'jn4lNAfwD0g' };
    // B3: Cyber
    if (index === 3) return { type: 'link', path: '/floor/cyber', videoId: '5wRM7c9uJ2Q' };
    // B9: Nature
    if (index === 9) return { type: 'link', path: '/floor/nature', videoId: 'L_LUpnjgPso' };

    const excuses = ["今天没货 (No Stock)", "去找新鲜的了 (Gone Fishing)", "休一天 (Closed)", "Wait...", "Empty"];
    return { type: 'empty', text: excuses[index % excuses.length] };
  };

  return (
    <main style={{ backgroundColor: "#111", minHeight: "100vh", padding: "20px", color: "#fff" }}>
      <style jsx global>{`
        @keyframes screenOn { 0% { opacity: 0; filter: brightness(0); } 50% { opacity: 1; filter: brightness(2); } 100% { opacity: 1; filter: brightness(1); } }
        @media (max-width: 768px) {
          .monitor-container { gap: 8px !important; }
          .mobile-monitor { width: 48% !important; padding: 8px !important; border-radius: 10px !important; aspect-ratio: 5/4 !important; height: auto !important; }
          .mobile-screen { height: 75% !important; border-radius: 4px !important; }
          .monitor-label { margin-top: 4px !important; font-size: 9px !important; }
        }
      `}</style>

      <h1 style={{ textAlign: "center", fontFamily: "monospace", opacity: 0.3, marginBottom: "40px", letterSpacing: "5px" }}>
        FILTER SHOP B.P.O
      </h1>
      
      <div className="monitor-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Monitor key={i} index={i + 1} floorData={getMonitorData(i)} />
        ))}
      </div>

      {/* 隠しリンク（B13: STAFF ONLY） */}
      <a href="/floor/admin" style={{ position: "fixed", bottom: "10px", left: "10px", width: "20px", height: "20px", opacity: 0, cursor: "default" }}></a>

      {/* ★復活させた売店リンク★ */}
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
  monitorFrame: { width: "300px", height: "240px", background: "#222", borderRadius: "20px", padding: "15px", boxShadow: "0 0 20px rgba(0,0,0,0.8), inset 0 0 10px #000", border: "2px solid #333", position: "relative" },
  screen: { width: "100%", height: "180px", background: "#000", borderRadius: "40% 40% 40% 40% / 10% 10% 10% 10%", overflow: "hidden", position: "relative", boxShadow: "inset 0 0 20px rgba(0,0,0,1)", border: "1px solid #444" },
  scanline: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))", backgroundSize: "100% 2px, 3px 100%", pointerEvents: "none", zIndex: 10 }
};