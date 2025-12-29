"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FakeRestaurant() {
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [showSoup, setShowSoup] = useState(false);
  const [showBill, setShowBill] = useState(false);

  // 注文処理
  const order = (price) => {
    // "时价"や"售罄"などの文字を除外して計算
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice)) {
      setTotal(prev => prev + numPrice);
    }
    // 注文するとスープが出る（おまけ）
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

  // --- メニューデータ（価格の英語も排除） ---
  const menuCategories = [
    {
      title: "【凉菜・前菜】",
      items: [
        { name: "皮蛋豆腐", price: "5.0" },
        { name: "凉拌海带丝", price: "4.5" },
        { name: "蒜泥白肉", price: "12.0" },
        { name: "凉拌焦虑", price: "0.0" },
        { name: "拍黄瓜", price: "4.0" },
        { name: "口水鸡", price: "15.0" },
        { name: "夫妻肺片", price: "18.0" },
        { name: "盐水沉默", price: "时价" },
        { name: "五香牛肉", price: "22.0" },
        { name: "红油耳丝", price: "10.0" },
        { name: "老醋花生", price: "6.0" },
        { name: "麻酱油麦菜", price: "8.0" },
        { name: "昨夜的剩菜", price: "2.0" },
        { name: "香菜拌牛肉", price: "24.0" },
      ]
    },
    {
      title: "【热菜・肉类】",
      items: [
        { name: "宫保鸡丁", price: "18.0" },
        { name: "鱼香肉丝", price: "16.0" },
        { name: "回锅肉", price: "20.0" },
        { name: "水煮牛肉", price: "28.0" },
        { name: "爆炒拖延症", price: "11.5" },
        { name: "糖醋里脊", price: "18.0" },
        { name: "红烧肉", price: "26.0" },
        { name: "具体的绝望", price: "5.0" },
        { name: "辣子鸡丁", price: "22.0" },
        { name: "孜然羊肉", price: "32.0" },
        { name: "京酱肉丝", price: "18.0" },
        { name: "红烧那个下午", price: "99.0" },
        { name: "木须肉", price: "15.0" },
        { name: "葱爆羊肉", price: "30.0" },
      ]
    },
    {
      title: "【热菜・素菜】",
      items: [
        { name: "麻婆豆腐", price: "8.0" },
        { name: "地三鲜", price: "12.0" },
        { name: "清炒时蔬", price: "10.0" },
        { name: "无法挽回的时间", price: "售罄" }, // Sold Out -> 售罄
        { name: "番茄炒蛋", price: "10.0" },
        { name: "干煸四季豆", price: "14.0" },
        { name: "酸辣土豆丝", price: "8.0" },
        { name: "家常豆腐", price: "12.0" },
        { name: "油炸且过", price: "3.5" },
        { name: "虎皮青椒", price: "9.0" },
        { name: "红烧茄子", price: "11.0" },
      ]
    },
    {
      title: "【汤・主食】",
      items: [
        { name: "西红柿蛋汤", price: "5.0" },
        { name: "酸辣汤", price: "6.0" },
        { name: "紫菜蛋花汤", price: "4.0" },
        { name: "混沌汤", price: "6.5" },
        { name: "米饭", price: "1.0" },
        { name: "扬州炒饭", price: "15.0" },
        { name: "水饺(猪肉白菜)", price: "12.0" },
        { name: "什么都没有", price: "100.0" },
        { name: "炸酱面", price: "14.0" },
        { name: "担担面", price: "8.0" },
        { name: "馒头", price: "1.0" },
      ]
    },
    {
      title: "【酒水・饮料】",
      items: [
        { name: "青岛啤酒", price: "6.0" },
        { name: "二锅头", price: "15.0" },
        { name: "王老吉", price: "4.0" },
        { name: "酸梅汤", price: "5.0" },
        { name: "忘情水", price: "50.0" },
        { name: "冰红茶", price: "3.0" },
        { name: "椰树牌椰汁", price: "5.0" },
      ]
    }
  ];

  return (
    <main style={{ backgroundColor: "#fcfcf5", minHeight: "100vh", fontFamily: "'SimSun', 'Songti SC', serif", color: "#b00", cursor: "default" }}>
      
      {/* --- ヘッダー（完全中国語化） --- */}
      <header style={{ 
        padding: "15px", 
        background: "#b00", 
        color: "#ff0", 
        textAlign: "center", 
        borderBottom: "5px double #ff0", 
        position: "sticky", 
        top: 0, 
        zIndex: 10,
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
      }}>
        {/* 店名変更：大福海平歇一歇 */}
        <h1 style={{ fontSize: "24px", margin: 0, fontWeight: "900", fontFamily: "'SimHei', sans-serif", lineHeight: "1" }}>
          大福海平歇一歇
        </h1>
        <div style={{ fontSize: "10px", letterSpacing: "1px", marginTop: "4px" }}>中华老字号 / 地道家常菜</div>
      </header>

      {/* --- メインコンテンツ --- */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "10px" }}>
        
        <div style={{ 
          background: "#fff",
          padding: "15px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          columnCount: 3, 
          columnGap: "10px",
          border: "2px solid #b00",
          position: "relative",
          paddingBottom: "60px" // 下部の余白確保
        }}>
          
          {menuCategories.map((cat, i) => (
            <div key={i} style={{ breakInside: "avoid", marginBottom: "15px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "900", borderBottom: "2px solid #b00", marginBottom: "5px", paddingTop: "5px", lineHeight: "1.2" }}>
                {cat.title}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {cat.items.map((item, j) => (
                  <li key={j} onClick={() => order(item.price)} style={{ 
                    display: "flex", justifyContent: "space-between", alignItems: "bottom",
                    borderBottom: "1px dotted #eeb", fontSize: "13px", lineHeight: "1.3", padding: "1px 0",
                    cursor: "pointer", color: "#000"
                  }}>
                    <span style={{ fontFamily: "'SimSun', serif", fontWeight: "600" }}>{item.name}</span>
                    <span style={{ color: "#b00", fontWeight: "bold", fontSize: "12px" }}>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 会計ボタン（中国語） */}
          <div 
            onClick={() => setShowBill(true)}
            onMouseOver={(e) => {e.currentTarget.style.background = "#b00"; e.currentTarget.style.color = "#fff";}}
            onMouseOut={(e) => {e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#b00";}}
            style={{ 
              breakInside: "avoid", 
              marginTop: "20px", 
              border: "3px solid #b00", 
              padding: "10px", 
              textAlign: "center", 
              fontSize: "14px", 
              color: "#b00", 
              fontWeight: "bold", 
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <p style={{ margin: 0 }}>现金支付 / 拒绝赊账</p>
          </div>

           <div style={{ breakInside: "avoid", marginTop: "15px", textAlign: "center", fontSize: "10px", color: "#666" }}>
            <p style={{ margin: 0 }}>本店不承担精神损失</p>
            <p style={{ margin: 0 }}>有海才开 / 没海不开</p>
            
            {/* ★ここが隠しボタンです。「累了就歇一歇（疲れたら休んでいきなよ）」というスローガンに見せかけています。 */}
            <p 
              onClick={enterBackroom}
              style={{ 
                margin: "5px 0 0 0", 
                color: "#b00", 
                fontWeight: "bold", 
                cursor: "pointer", // あえて普通のポインターにして気づかせない、あるいは default にする
                display: "inline-block",
                borderBottom: "1px solid transparent",
                transition: "border-color 0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.borderBottom = "1px solid #b00"}
              onMouseOut={(e) => e.currentTarget.style.borderBottom = "1px solid transparent"}
            >
              累了就歇一歇。
            </p>
          </div>

        </div>
      </div>

      {/* --- ポップアップ 1: スープ (中国語) --- */}
      {showSoup && (
        <div onClick={closeSoup} style={{ 
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "#fff", padding: "20px", border: "4px double #b00", textAlign: "center", maxWidth: "80%" }}>
            <h3 style={{ color: "#b00", margin: "0 0 10px" }}>本店赠送</h3>
            <p style={{ fontSize: "14px", fontWeight: "bold" }}>特制老母鸡汤</p>
            <div style={{ width: "100px", height: "100px", background: "radial-gradient(circle, #fc0, #f80)", borderRadius: "50%", margin: "10px auto", border: "3px solid #fff", boxShadow: "0 0 10px #aaa" }}></div>
            <p style={{ fontSize: "10px", color: "#888" }}>（点击喝完）</p>
          </div>
        </div>
      )}

      {/* --- ポップアップ 2: お会計 (中国語) --- */}
      {showBill && (
        <div onClick={closeBill} style={{ 
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(0,0,0,0.8)", zIndex: 101, display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div style={{ background: "#fff", width: "250px", padding: "20px", fontFamily: "monospace", boxShadow: "0 0 20px #000" }}>
             <h3 style={{ textAlign: "center", borderBottom: "1px dashed #000", paddingBottom: "10px", margin: 0 }}>收款单</h3>
             <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0" }}>
               <span>总计</span>
               <span style={{ fontSize: "20px", fontWeight: "bold" }}>${total.toFixed(2)}</span>
             </div>
             <p style={{ textAlign: "center", fontSize: "12px", color: "#b00" }}>仅收现金 / 概不赊账</p>
             <p style={{ textAlign: "center", fontSize: "10px", color: "#ccc", marginTop: "20px" }}>（点击支付）</p>
          </div>
        </div>
      )}

    </main>
  );
}