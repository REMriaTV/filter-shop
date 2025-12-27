import Link from 'next/link';
// app/page.js
export default function Home() {
  // あなたが選んだ「焚き火」や「Vlog」の動画IDリスト
  const videoIds = [
    "5qap5aO4i9A", // lofi hip hop (例)
    "9FvvbVI5rYA", // 焚き火 (例)
    "Dx5qFacha3o", // Jazz piano (例)
  ];

  return (
    <main style={{ backgroundColor: "#111", minHeight: "100vh", padding: "20px", color: "#fff" }}>
      <h1 style={{ textAlign: "center", fontFamily: "monospace", opacity: 0.5 }}>Filter</h1>
      
      {/* モニターを並べる棚 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", marginTop: "40px" }}>
        
        {videoIds.map((id) => (
          <div key={id} style={styles.monitorFrame}>
            {/* 画面部分 */}
            <div style={styles.screen}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${id}?controls=0&modestbranding=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ pointerEvents: "none" }} // クリックさせず、ただ流すだけにするならこれ
              ></iframe>
              {/* 走査線エフェクト（ブラウン管っぽさ） */}
              <div style={styles.scanline}></div>
            </div>
            {/* モニターの下のロゴとか電源ランプ */}
            <div style={{ marginTop: "5px", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444" }}>
              <span>SONY</span>
              <span style={{ width: "6px", height: "6px", background: "red", borderRadius: "50%", boxShadow: "0 0 5px red" }}></span>
            </div>
          </div>
        ))}

      </div>

      {/* 右下の売店アイコン */}
      <Link href="/shop">
  <div style={{ position: "fixed", bottom: "20px", right: "20px", cursor: "pointer" }}>
    <div style={{ border: "1px solid #555", padding: "10px", background: "#000", fontFamily: "serif", color: "#fff" }}>
      売店 <br/><span style={{fontSize: "0.8rem"}}>Kiosk -&gt;</span>
    </div>
  </div>
</Link>
    </main>
  );
}

// 簡易的なCSS（本来はCSSファイルに書くけど、コピペで動くようにここに書きます）
const styles = {
  monitorFrame: {
    width: "300px",
    height: "240px",
    background: "#222",
    borderRadius: "20px",
    padding: "15px",
    boxShadow: "0 0 20px rgba(0,0,0,0.8), inset 0 0 10px #000",
    border: "2px solid #333",
  },
  screen: {
    width: "100%",
    height: "180px",
    background: "#000",
    borderRadius: "40% 40% 40% 40% / 10% 10% 10% 10%", // 画面の膨らみを表現
    overflow: "hidden",
    position: "relative",
    boxShadow: "inset 0 0 20px rgba(0,0,0,1)", // 画面内側の影
    border: "1px solid #444",
  },
  scanline: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
    backgroundSize: "100% 2px, 3px 100%", // 走査線の細かさ
    pointerEvents: "none",
    zIndex: 10,
  }
};