"use client";
// 中身は他フロアと同じですが、動画リストを海系にしています
import Link from 'next/link';
import { useEffect, useState } from 'react';

// (Monitorコンポーネントは共通なので省略せず書く必要がありますが、
// 長くなるので今回は前のコードと同じ「Monitor」を使ってください)
// ※実際にはコンポーネントを共通化すべきですが、今回はコピペで動くように簡易化します

const Monitor = ({ videoId, index }) => {
  // ... (前のコードと同じMonitorコンポーネントの中身) ...
  // ※ここに必ず前のコードと同じ Monitor の定義を入れてください！
  const [isClient, setIsClient] = useState(false);
  const [config, setConfig] = useState({ startTime: 0, delay: 0, origin: "" });
  useEffect(() => { setIsClient(true); setConfig({ startTime: Math.floor(Math.random() * 600), delay: Math.random() * 12, origin: window.location.origin }); }, []);
  if (!isClient) return <div style={{width:"300px", height:"240px", background:"#222"}} />;
  return (
    <div style={{width:"300px", height:"240px", background:"#222", borderRadius:"20px", padding:"15px", border:"2px solid #333", position:"relative"}} className="mobile-monitor">
      <div style={{width:"100%", height:"180px", background:"#000", borderRadius:"10px", overflow:"hidden", position:"relative"}} className="mobile-screen">
        {config.origin && <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=${videoId}&start=${config.startTime}&origin=${config.origin}&playsinline=1`} frameBorder="0" style={{pointerEvents:"auto", opacity:0, animation:`screenOn 0.2s ease-out forwards`, animationDelay:`${config.delay}s`}} />}
      </div>
      <div className="monitor-label" style={{marginTop:"5px", display:"flex", justifyContent:"space-between", fontSize:"10px", color:"#444"}}>
        <span>OCEAN</span><span style={{width:"6px", height:"6px", background:"#00f", borderRadius:"50%", boxShadow:"0 0 6px #00f"}}></span>
      </div>
    </div>
  );
};

export default function OceanFloor() {
  const videoIds = ["jn4lNAfwD0g", "jn4lNAfwD0g", "jn4lNAfwD0g", "jn4lNAfwD0g"]; // ダイビングなど
  return (
    <main style={{ backgroundColor: "#000510", minHeight: "100vh", padding: "20px", color: "#aaf" }}>
      <h1 style={{ textAlign: "center", fontFamily: "monospace", opacity: 0.5, marginBottom: "40px" }}>Filter / OCEAN</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {videoIds.map((id, index) => <Monitor key={index} videoId={id} index={index} />)}
      </div>
      {/* 戻るボタン */}
      <Link href="/reception"><div style={{position:"fixed", bottom:"20px", left:"20px", color:"#fff", cursor:"pointer"}}>&lt; RECEPTION</div></Link>
    </main>
  );
}