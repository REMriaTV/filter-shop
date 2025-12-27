// app/shop/page.js
import Link from 'next/link';

export default function Shop() {
  return (
    <main style={{ backgroundColor: "#050505", minHeight: "100vh", padding: "40px", color: "#e0e0e0", fontFamily: "serif" }}>
      {/* ナビゲーション */}
      <nav style={{ marginBottom: "60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none", color: "#555", fontSize: "0.9rem" }}>← Back to Filter</Link>
        <div style={{ letterSpacing: "0.2em", fontSize: "0.8rem", color: "#444" }}>KIOSK</div>
      </nav>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "50px" }}>
        
        {/* 商品セクション */}
        <section style={{ display: "flex", gap: "60px", flexWrap: "wrap", alignItems: "center" }}>
          
          {/* 写真エリア */}
          <div style={{ flex: "1 1 350px", display: "flex", justifyContent: "center" }}>
            <img 
              src="/white_001.jpg"
              alt="しろいぼう"
              style={{ 
                width: "100%", 
                maxWidth: "400px", 
                height: "auto", 
                objectFit: "contain",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
              }} 
            />
          </div>

          {/* 商品説明エリア */}
          <div style={{ flex: "1 1 300px" }}>

            <Link href="/story" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", letterSpacing: "0.15em", fontWeight: "normal", color: "#fff", cursor: "pointer" }}>
                The Draft
              </h1>
            </Link>

            <div style={{ marginBottom: "40px", lineHeight: "2", color: "#aaa", fontSize: "0.95rem", borderLeft: "2px solid #333", paddingLeft: "20px" }}>
              <p>成分：石塑粘土、漆、狂気、静寂</p>
              <p>効能：深呼吸の補助、物語への没入</p>
            </div>

            <div style={{ marginBottom: "40px" }}>
              {/* ▼▼▼ ここがメール機能の部分です ▼▼▼ */}
              <a href="mailto:remuriatv@gmail.com?subject=The Draft 購入希望&body=制作主の気分はいかがですか？在庫があれば譲ってください。">
                <button style={{ 
                  background: "transparent", 
                  border: "1px solid #888", 
                  color: "#fff", 
                  padding: "15px 40px", 
                  cursor: "pointer",
                  fontFamily: "serif",
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  transition: "0.3s"
                }}>
                  手に入れる
                </button>
              </a>
              {/* ▲▲▲ ここまで ▲▲▲ */}
              
              <p style={{ marginTop: "15px", fontSize: "0.7rem", color: "#444" }}>※在庫状況：制作主の気分別</p>
            </div>
            
          </div>
          
        </section>

      </div>
    </main>
  );
}