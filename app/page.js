// app/page.js
import Link from 'next/link';

export default function Home() {
  // ★ここに「仕入れ」た動画IDを並べます（現在20本）
 // app/page.js の videoIds をこれに書き換えてください

  const videoIds = [
    // --- ❄️ 雪と鉄道（Snow & Train） ---
    "Py14tL6q3Js", // スイス・ベルニナ急行（雪景色と線路）★絶景
    "vzKv5dM6pM8", // ノルウェーの雪景色を走る鉄道（4K）
    "F6OQnUqD9uU", // 雪の降る冬の森と鉄道の音

    // --- 🔥 焚き火と煙（Fire & Smoke） ---
    "L_LUpnjgPso", // 暖炉の音（音楽なし・パチパチ音のみ）
    "9FvvbVI5rYA", // 暗闇の焚き火（4K）
    "q76bMs-NwRk", // 雨音と暖炉（ジャズなし）

    // --- 🖊️ 書く・思考（Writing & Thinking） ---
    "jfKfPfyJRdk", // Lofi Girl（定番・ずっと流れる）
    "5qap5aO4i9A", // Lofi Hip Hop Radio
    "nepbW3g1TzE", // 雨の窓辺（アニメーション）
    "TURbewk2wwg", // Silent Vlog (生活音・静寂)

    // --- 🌧️ 雨と路地裏（Rain & Cyber） ---
    "JkHp3g_K0TU", // 雨の夜のコーヒーショップ
    "5wRM7c9uJ2Q", // サイバーパンクシティの雨音
    "Ptk_1Dc2iPY", // 深夜のコーディング（キーボード音）
    "S_0ikBGO7O0", // 未来的な部屋の環境音

    // --- 🌲 自然・ドローン（Nature） ---
    "tNkZsRW7h2c", // 宇宙船の環境音
    "1LEJ6rL8PZc", // 雨の森（4Kドローン）
  ];

  return (
    <main style={{ backgroundColor: "#111", minHeight: "100vh", padding: "20px", color: "#fff" }}>
      <h1 style={{ textAlign: "center", fontFamily: "monospace", opacity: 0.5, marginBottom: "40px" }}>Filter</h1>
      
      {/* モニターを並べる棚 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        
        {videoIds.map((id, index) => (
          <div key={index} style={styles.monitorFrame}>
            {/* 画面部分 */}
            <div style={styles.screen}>
              <iframe
                width="100%"
                height="100%"
                // ▼▼▼ ここを変える（autoplay=1 と mute=1 を追加） ▼▼▼
  src={`https://www.youtube.com/embed/${id}?controls=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=${id}`}
  // ▲▲▲ ここまで ▲▲▲
                title="YouTube video player"
                frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  style={{ pointerEvents: "auto" }} // クリックして音量操作できるようにする
              ></iframe>
              {/* 走査線エフェクト */}
              <div style={styles.scanline}></div>
            </div>
            
            <div style={{ marginTop: "5px", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#444" }}>
              <span>SONY</span>
              <span style={{ width: "6px", height: "6px", background: "red", borderRadius: "50%", boxShadow: "0 0 5px red" }}></span>
            </div>
          </div>
        ))}

      </div>

      {/* 右下の売店アイコン */}
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
  monitorFrame: {
    width: "300px",
    height: "240px",
    background: "#222",
    borderRadius: "20px",
    padding: "15px",
    boxShadow: "0 0 20px rgba(0,0,0,0.8), inset 0 0 10px #000",
    border: "2px solid #333",
    position: "relative", // 走査線の基準
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
    // 走査線を少し薄くして、動画を見やすくしました
    background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
    backgroundSize: "100% 2px, 3px 100%",
    pointerEvents: "none", // 走査線はクリックを邪魔しないようにスルーさせる
    zIndex: 10,
  }
};