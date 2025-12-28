"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FakeRestaurant() {
  const router = useRouter();
  const [soupState, setSoupState] = useState('none'); // none | full | empty

  // 注文クリック時の処理
  const order = () => {
    setSoupState('full');
  };

  // スープを飲む処理
  const drinkSoup = () => {
    setSoupState('empty');
  };

  // 合言葉クリック（裏口へ）
  const enterBackroom = () => {
    router.push('/reception');
  };

  return (
    <main style={{ backgroundColor: "#fdfdf5", minHeight: "100vh", fontFamily: "'Times New Roman', serif", color: "#333" }}>
      {/* --- ヘッダー（機能しない安っぽいリンク） --- */}
      <header style={{ padding: "20px", borderBottom: "4px double #d00", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "32px", color: "#d00", margin: 0, fontWeight: "bold" }}>海平歇一歇</h1>
          <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>Hǎipíng Xiē-yī-Xiē Chinese Restaurant</p>
        </div>
        <nav style={{ fontSize: "14px", textDecoration: "underline", color: "blue", cursor: "help" }}>
          <span style={{ margin: "0 10px" }}>Home</span>
          <span style={{ margin: "0 10px" }}>Menu</span>
          <span style={{ margin: "0 10px" }}>Location</span>
        </nav>
      </header>

      {/* --- メインコンテンツ（メニュー表） --- */}
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", background: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.1)", border: "1px solid #ddd" }}>
        
        {/* お知らせ張り紙風 */}
        <div style={{ background: "#ffffe0", padding: "10px", border: "1px solid #e0e000", marginBottom: "30px", fontSize: "14px", color: "#550" }}>
          <strong>Notice:</strong> We are open today. Cash only. No wifi.
        </div>

        <h2 style={{ textAlign: "center", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>今日吃什么? (Today's Menu)</h2>

        <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* 左側：適当なメニューリスト */}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {['海平炒饭 (Fried Rice)', '家常豆腐 (Tofu)', '西红柿炒蛋 (Tomato Egg)', '水饺 (Dumplings)'].map((item, i) => (
              <li key={i} onClick={order} style={{ padding: "10px", borderBottom: "1px dashed #ccc", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                <span>{item}</span>
                <span style={{ color: "#d00" }}>$5.00</span>
              </li>
            ))}
          </ul>
          {/* 右側：画像っぽい枠（読み込めてない風） */}
          <div style={{ border: "1px solid #ccc", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "12px", minHeight: "200px" }}>
            [Image missing]
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button onClick={order} style={{ padding: "10px 30px", fontSize: "18px", background: "#d00", color: "#fff", border: "none", cursor: "pointer" }}>
            今天这样吧 (Order This)
          </button>
        </div>
      </div>

      {/* --- フッター --- */}
      <footer style={{ textAlign: "center", padding: "20px", fontSize: "12px", color: "#aaa", borderTop: "1px solid #eee", marginTop: "50px" }}>
        &copy; 1998-2025 海平歇一歇. All rights reserved.
      </footer>

      {/* --- モーダル（鶏スープ） --- */}
      {soupState !== 'none' && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
          
          <div style={{ background: "#fff", padding: "30px", borderRadius: "10px", textAlign: "center", maxWidth: "90%" }}>
            {soupState === 'full' ? (
              // 満杯のスープ
              <div onClick={drinkSoup} style={{ cursor: "pointer" }}>
                <h3 style={{ color: "#333" }}>鶏汤 (Chicken Soup)</h3>
                <p style={{ fontSize: "12px", color: "#666" }}>Service from the owner.</p>
                {/* スープのイラスト代わりのCSS円 */}
                <div style={{ width: "200px", height: "200px", background: "radial-gradient(circle at 30% 30%, #ffd700, #daa520)", borderRadius: "50%", margin: "20px auto", border: "5px solid #fff", boxShadow: "0 0 15px rgba(0,0,0,0.2)" }}></div>
                <p style={{ color: "#d00", fontSize: "14px" }}>Click to drink</p>
              </div>
            ) : (
              // 飲み干したスープ
              <div>
                <h3 style={{ color: "#ccc" }}>Empty.</h3>
                {/* 空の器 */}
                <div style={{ width: "200px", height: "200px", background: "#fff", borderRadius: "50%", margin: "20px auto", border: "5px solid #ddd", boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {/* 合言葉 */}
                    <span onClick={enterBackroom} style={{ fontSize: "24px", fontWeight: "bold", cursor: "pointer", color: "#333", fontFamily: "monospace" }}>
                        歇一歇？
                    </span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}