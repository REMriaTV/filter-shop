"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  const isGlitch = index === 4; 

  return (
    <div 
      onClick={handleClick}
      style={{
        ...styles.monitorFrame,
        cursor: floorData.type === 'link' ? 'pointer' : 'default',
        borderColor: isGlitch ? "#444" : "#333",
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
            style={{ 
              pointerEvents: "none", 
              opacity: 0, 
              animation: `screenOn 0.2s ease-out forwards`, 
              animationDelay: `${config.delay}s`,
              filter: isGlitch ? "contrast(1.5) sepia(1)" : "none"
            }}
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
        <span>No.{String(index).padStart(2, '0')}</span>
        <span style={{ 
          width: "6px", height: "6px", 
          background: floorData.type === 'link' ? (isGlitch ? "#fff" : "#d00") : "#333",
          borderRadius: "50%", 
          boxShadow: floorData.type === 'link' ? (isGlitch ? "0 0 6px #fff" : "0 0 6px #f00") : "none",
          transition: "background 0.3s",
          opacity: 0,
          animation: `screenOn 0.2s ease-out forwards`,
          animationDelay: `${config.delay}s`
        }}></span>
      </div>

      {/* 透明なクリック判定レイヤー */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 50 }}></div>

    </div>
  );
};

// --- 受付メイン ---
export default function Reception() {
  
  // ★追加: ページマウント時に残っているヘッダーを削除
  useEffect(() => {
    // トップページのヘッダーが残っていたら削除
    const restaurantHeader = document.getElementById('restaurant-header');
    if (restaurantHeader) {
      restaurantHeader.remove();
    }
    
    // または、背景が赤いヘッダーをすべて削除
    const headers = document.querySelectorAll('header');
    headers.forEach(header => {
      const bgColor = window.getComputedStyle(header).backgroundColor;
      if (bgColor === 'rgb(187, 0, 0)' || bgColor === '#b00') {
        header.remove();
      }
    });
    
    // bodyの背景色を確実に黒に設定
    document.body.style.backgroundColor = '#000';
    document.body.style.color = '#fff';
    document.documentElement.style.backgroundColor = '#000';
    
    // スクロール位置をトップにリセット
    window.scrollTo(0, 0);
    
    // 定期的にチェックして残っている赤い要素を削除（保険）
    const cleanupInterval = setInterval(() => {
      document.querySelectorAll('*').forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.backgroundColor === 'rgb(187, 0, 0)' || 
            style.backgroundColor === '#b00' ||
            style.color === 'rgb(255, 255, 0)' ||
            style.color === '#ff0') {
          if (element.tagName !== 'BODY' && element.tagName !== 'HTML') {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
          }
        }
      });
    }, 100);
    
    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  const getMonitorData = (i) => {
    const index = i + 1;
    if (index === 1) return { type: 'link', path: '/floor/ocean', videoId: 'jn4lNAfwD0g' };
    if (index === 3) return { type: 'link', path: '/floor/cyber', videoId: '5wRM7c9uJ2Q' };
    if (index === 4) return { type: 'link', path: '/floor/admin', videoId: '09R8_2nJtjg' }; 
    if (index === 9) return { type: 'link', path: '/floor/nature', videoId: 'L_LUpnjgPso' };

    const excuses = ["今天没货 (No Stock)", "去找新鲜的了 (Gone Fishing)", "休一天 (Closed)", "Wait...", "Empty", "System Check", "404 Not Found"];
    return { type: 'empty', text: excuses[index % excuses.length] };
  };

  return (
    // ★変更: minHeightを "100dvh" にしてモバイルのアドレスバー対策
    <main style={{ 
      backgroundColor: "#000", 
      minHeight: "100dvh", 
      width: "100%",
      padding: "20px", 
      color: "#fff", 
      position: "relative",
      overflowX: "hidden"
    }}>
      <style jsx global>{`
        /* ★追加: ページ全体の背景色を強制的に黒にする */
        html, body {
          background-color: #000 !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        /* トップページのヘッダーを確実に非表示 */
        #restaurant-header,
        header[style*="background: #b00"],
        header[style*="background-color: #b00"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          position: absolute !important;
          pointer-events: none !important;
          opacity: 0 !important;
        }

        @keyframes screenOn { 0% { opacity: 0; filter: brightness(0); } 50% { opacity: 1; filter: brightness(2); } 100% { opacity: 1; filter: brightness(1); } }
        
        @keyframes curtainFadeOut { 
          from { opacity: 1; pointer-events: all; } 
          to { opacity: 0; pointer-events: none; } 
        }

        @media (max-width: 768px) {
          .monitor-container { gap: 8px !important; }
          .mobile-monitor { width: 48% !important; padding: 8px !important; border-radius: 10px !important; aspect-ratio: 5/4 !important; height: auto !important; }
          .mobile-screen { height: 75% !important; border-radius: 4px !important; }
          .monitor-label { margin-top: 4px !important; font-size: 9px !important; }
        }
      `}</style>

      {/* 画面遷移時のフラッシュ防止用「黒い幕」 */}
      {/* ★変更: heightを "100dvh" にして画面全体を確実に覆う */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100dvh",
        backgroundColor: "#000",
        zIndex: 9999, // 最前面
        animation: "curtainFadeOut 3s ease-out forwards"
      }}></div>

      <h1 style={{ textAlign: "center", fontFamily: "monospace", opacity: 0.3, marginBottom: "40px", letterSpacing: "5px" }}>
        FILTER SHOP B.P.O
      </h1>
      
      <div className="monitor-container" style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Monitor key={i} index={i + 1} floorData={getMonitorData(i)} />
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

const styles = {
  monitorFrame: { width: "300px", height: "240px", background: "#222", borderRadius: "20px", padding: "15px", boxShadow: "0 0 20px rgba(0,0,0,0.8), inset 0 0 10px #000", border: "2px solid #333", position: "relative" },
  screen: { width: "100%", height: "180px", background: "#000", borderRadius: "40% 40% 40% 40% / 10% 10% 10% 10%", overflow: "hidden", position: "relative", boxShadow: "inset 0 0 20px rgba(0,0,0,1)", border: "1px solid #444" },
  scanline: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))", backgroundSize: "100% 2px, 3px 100%", pointerEvents: "none", zIndex: 10 }
};