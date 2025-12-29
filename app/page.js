"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FakeRestaurant() {
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [showSoup, setShowSoup] = useState(false);
  const [showBill, setShowBill] = useState(false);

  const order = (price) => {
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice)) {
      setTotal(prev => prev + numPrice);
    }
    setShowSoup(true);
  };

  const closeSoup = () => {
    setShowSoup(false);
  };
  
  const closeBill = () => {
    setShowBill(false);
  };

  const enterBackroom = () => {
    router.push('/reception');
  };

  const menuCategories = [
    {
      title: ":: Cold Dishes / 凉菜 ::",
      items: [
        { name: "皮蛋豆腐 (Preserved Egg)", price: "5.0" },
        { name: "凉拌海带丝 (Seaweed)", price: "4.5" },
        { name: "蒜泥白肉 (Pork w/ Garlic)", price: "12.0" },
        { name: "凉拌焦虑 (Cold Anxiety)", price: "0.0" },
        { name: "拍黄瓜 (Cucumber)", price: "4.0" },
        { name: "口水鸡 (Spicy Chicken)", price: "15.0" },
        { name: "夫妻肺片 (Beef Tripe)", price: "18.0" },
        { name: "盐水沉默 (Salty Silence)", price: "Market Price" },
      ]
    },
    {
      title: ":: Hot Dishes / 热菜 ::",
      items: [
        { name: "宫保鸡丁 (Kung Pao Chicken)", price: "18.0" },
        { name: "鱼香肉丝 (Pork strip)", price: "16.0" },
        { name: "回锅肉 (Double Cooked Pork)", price: "20.0" },
        { name: "水煮牛肉 (Boiled Beef)", price: "28.0" },
        { name: "爆炒拖延症 (Fried Delay)", price: "11.5" },
        { name: "糖醋里脊 (Sweet Sour Pork)", price: "18.0" },
        { name: "红烧肉 (Braised Pork)", price: "26.0" },
        { name: "具体的绝望 (Specific Despair)", price: "5.0" },
        { name: "红烧那个下午 (That Afternoon)", price: "99.0" },
      ]
    },
    {
      title: ":: Soup & Rice / 主食 ::",
      items: [
        { name: "西红柿蛋汤 (Tomato Soup)", price: "5.0" },
        { name: "酸辣汤 (Hot Sour Soup)", price: "6.0" },
        { name: "混沌汤 (Chaos Soup)", price: "6.5" },
        { name: "米饭 (Rice)", price: "1.0" },
        { name: "扬州炒饭 (Fried Rice)", price: "15.0" },
        { name: "什么都没有 (Nothing)", price: "100.0" },
      ]
    }
  ];

  return (
    // 背景：黄色いテクスチャ風、または単色クリーム色 #FFFFCC
    <main style={{ backgroundColor: "#FFFFCC", minHeight: "100vh", fontFamily: "'Times New Roman', serif", color: "#8B0000" }}>
      
      {/* センター寄せのコンテナ */}
      <div style={{ width: "800px", margin: "0 auto", backgroundColor: "#FFFFFF", border: "1px solid #000000", paddingBottom: "50px" }}>
        
        {/* ヘッダー：原色赤の背景に黄色文字 */}
        <header style={{ backgroundColor: "#FF0000", padding: "20px", textAlign: "center", borderBottom: "5px solid #FFD700" }}>
          <h1 style={{ color: "#FFFF00", margin: 0, fontSize: "40px", fontFamily: "'SimHei', sans-serif", textShadow: "2px 2px #000" }}>
            海平歇一歇
          </h1>
          <div style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: "14px", marginTop: "5px" }}>
            HAIPING CHINESE RESTAURANT HOMEPAGE
          </div>
        </header>

        {/* ナビゲーションバー */}
        <div style={{ textAlign: "center", padding: "5px", borderBottom: "1px solid #ccc", backgroundColor: "#eeeeee", fontSize: "12px" }}>
          <span style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer" }}>Top</span> | 
          <span style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer" }}>Menu</span> | 
          <span style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer" }}>Location</span> | 
          <span style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer" }}>Mail</span>
        </div>

        {/* コンテンツエリア */}
        <div style={{ padding: "20px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <p style={{ color: "#FF0000", fontWeight: "bold" }}>
              *** WELCOME TO OUR HOMEPAGE ***
            </p>
            <p style={{ fontSize: "12px" }}>
              Traditional Taste / Cash Only / No Service Charge
            </p>
            <hr style={{ width: "80%", color: "red" }} />
          </div>

          {/* メニュー表：HTMLテーブル */}
          <table width="90%" align="center" border="0" cellPadding="5">
            {menuCategories.map((cat, i) => (
              <tbody key={i}>
                <tr>
                  <td colSpan="2" style={{ backgroundColor: "#FFCC00", color: "#8B0000", fontWeight: "bold", textAlign: "center" }}>
                    {cat.title}
                  </td>
                </tr>
                {cat.items.map((item, j) => (
                  <tr key={j}>
                    <td style={{ borderBottom: "1px dotted #ccc" }}>
                      <span 
                        onClick={() => order(item.price)}
                        style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer", fontSize: "14px" }}
                      >
                        {item.name}
                      </span>
                    </td>
                    <td align="right" style={{ borderBottom: "1px dotted #ccc", color: "#FF0000", fontWeight: "bold" }}>
                      ${item.price}
                    </td>
                  </tr>
                ))}
                <tr><td colSpan="2" height="10"></td></tr>
              </tbody>
            ))}
          </table>
          
          <br/><br/>

          {/* 会計リンク：画像をリンクボタンにしたようなデザイン */}
          <div style={{ textAlign: "center", border: "2px dashed #FF0000", padding: "10px", margin: "20px auto", width: "60%" }}>
            <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "red" }}>Ready to Pay?</p>
            <button 
              onClick={() => setShowBill(true)}
              style={{ 
                background: "red", 
                color: "yellow", 
                border: "2px solid #000", 
                fontSize: "18px", 
                fontWeight: "bold", 
                cursor: "pointer",
                padding: "5px 20px"
              }}
            >
              CASHIER (CLICK HERE)
            </button>
          </div>

          <div style={{ textAlign: "center", fontSize: "10px", marginTop: "40px", color: "#666" }}>
            <p>Copyright 1998-2005 Haiping Restaurant</p>
            <p>Best view with Internet Explorer 5.0</p>
            
            {/* カウンター風 */}
            <div style={{ background: "#000", color: "#0f0", display: "inline-block", padding: "2px 5px", fontFamily: "monospace", border: "2px solid #888" }}>
              0 1 9 3 8 2
            </div>
          </div>

          {/* ★合言葉（裏口）★ */}
          {/* フッターの著作権表示の横に、背景と同化して置いておく */}
          <div 
            onClick={enterBackroom}
            style={{ 
              textAlign: "right", 
              marginTop: "20px", 
              color: "#FFFFFF", // 背景白なので見えない
              cursor: "default",
              fontSize: "12px"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#FF0000"} // マウスオーバーで赤くなる
            onMouseOut={(e) => e.currentTarget.style.color = "#FFFFFF"}
          >
            歇一歇？
          </div>

        </div>
      </div>

      {/* --- ポップアップ 1：呪いのスープ（DHTML風） --- */}
      {showSoup && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.0)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
          {/* 枠線のみのシンプルな箱 */}
          <div style={{ 
            background: "#FFFFCC", 
            border: "4px solid #FF0000", 
            width: "300px", 
            padding: "20px", 
            textAlign: "center",
            boxShadow: "10px 10px 0px rgba(0,0,0,0.2)" // 影もベタ塗り
          }}>
            <h3 style={{ color: "red", marginTop: 0, textDecoration: "underline" }}>INFORMATION</h3>
            
            {/* ドット絵風スープ */}
            <div style={{ 
                margin: "15px auto",
                width: "50px", height: "25px", 
                background: "#FFD700", 
                border: "2px solid #000",
                borderBottomLeftRadius: "25px",
                borderBottomRightRadius: "25px"
            }}></div>

            <p style={{ fontWeight: "bold", fontSize: "18px", fontFamily: "'SimSun', serif" }}>
               鶏汤已经准备好了。
            </p>
            <p style={{ fontSize: "12px", color: "#666" }}>
               (Soup is ready.)
            </p>
            
            <br/>
            <span 
              onClick={closeSoup} 
              style={{ color: "#0000EE", textDecoration: "underline", cursor: "pointer" }}
            >
              [ Close Window ]
            </span>
          </div>
        </div>
      )}

      {/* --- ポップアップ 2：お会計（DHTML風） --- */}
      {showBill && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(255,255,255,0.0)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 }}>
          <div style={{ 
            background: "#FFFFFF", 
            border: "4px double #000000", 
            width: "280px", 
            padding: "20px", 
            textAlign: "center",
            boxShadow: "10px 10px 0px #888"
          }}>
            <h3 style={{ marginTop: 0 }}>$$ BILL $$</h3>
            
            <p>Total:</p>
            <div style={{ fontSize: "32px", color: "red", fontWeight: "bold", fontFamily: "monospace", border: "1px solid #ccc", background: "#eee", margin: "10px 0" }}>
              ${total.toFixed(2)}
            </div>
            
            <br/>
            <button onClick={closeBill}>Pay Now</button>
            &nbsp;
            <button onClick={closeBill}>Cancel</button>
          </div>
        </div>
      )}

    </main>
  );
}