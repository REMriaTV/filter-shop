"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FakeRestaurant() {
  const [total, setTotal] = useState(0);
  const [showSoup, setShowSoup] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [hasDrunkSoup, setHasDrunkSoup] = useState(false);
  const [transitionStage, setTransitionStage] = useState(0);

  // ★追加：このページに来た時だけ、ブラウザのヘッダーを「赤」に書き換える
  useEffect(() => {
    // metaタグを探す
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    // なければ作る（念のため）
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    // 赤色に設定
    metaThemeColor.setAttribute("content", "#b00");

    // クリーンアップ：ページを離れる時に黒に戻す（これ重要）
    return () => {
      metaThemeColor.setAttribute("content", "#000000");
    };
  }, []);
  // -----------------------------------------------------------

  const order = (price) => {
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice)) {
      setTotal(prev => prev + numPrice);
    }
    setShowSoup(true);
  };

  const drinkSoup = () => {
    setHasDrunkSoup(true); 
    setShowSoup(false);    
  };

  const closeSoup = () => {
    setShowSoup(false);
  };
  
  const closeBill = () => {
    setShowBill(false);
  };

  const enterBackroom = () => {
    setTransitionStage(1);
  };

  // タイムラインの調整
  useEffect(() => {
    if (transitionStage === 1) {
      setTimeout(() => setTransitionStage(2), 2000);
    } else if (transitionStage === 2) {
      setTimeout(() => setTransitionStage(3), 4000); 
    } else if (transitionStage === 3) {
      setTimeout(() => setTransitionStage(4), 2000);
    } else if (transitionStage === 4) {
      // 強制ハード遷移（これはそのまま）
      window.location.href = '/reception'; 
    }
  }, [transitionStage]); 


  // --- メニューデータ ---
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
        { name: "无法挽回的时间", price: "售罄" }, 
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
      
      {/* --- ヘッダー --- */}
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
          paddingBottom: "60px"
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

          {/* 会計ボタン */}
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

          {/* 隠しリンクエリア */}
           <div style={{ breakInside: "avoid", marginTop: "30px", textAlign: "center", fontSize: "10px", color: "#666", lineHeight: "1.8" }}>
            <p style={{ margin: 0 }}>本店，位于海平线附近</p>
            <p style={{ margin: 0 }}>新鲜，从海拔0米开始</p>
            <p 
              style={{ 
                margin: 0, 
                color: "#666",
                cursor: hasDrunkSoup ? "pointer" : "default",
                opacity: hasDrunkSoup ? 1 : 0, 
                pointerEvents: hasDrunkSoup ? "auto" : "none",
              }}
              onClick={enterBackroom}
            >
              看着海面，歇一歇？
            </p>
          </div>

        </div>
      </div>

      {/* --- ポップアップ 1: スープ --- */}
      {showSoup && (
        <div onClick={closeSoup} style={{ 
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center"
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", padding: "30px", border: "4px double #b00", textAlign: "center", maxWidth: "300px", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
            <h3 style={{ color: "#b00", margin: "0 0 15px", fontFamily: "'SimSun', serif", fontSize: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                鶏汤已经准备好了。
            </h3>
            <div style={{ margin: "0 auto 15px" }}>
                <img src="/torisoba_1.png" alt="Chicken Soup" style={{ width: "100%", maxWidth: "200px", height: "auto", display: "block", margin: "0 auto", border: "1px solid #ccc", boxShadow: "2px 2px 5px rgba(0,0,0,0.2)" }} />
            </div>
            <div onClick={drinkSoup} style={{ marginTop: "10px", cursor: "pointer", fontSize: "14px", color: "#b00", textDecoration: "underline", fontWeight: "bold" }}>
                喝完
            </div>
          </div>
        </div>
      )}

      {/* --- ポップアップ 2: お会計 --- */}
      {showBill && (
        <div onClick={closeBill} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 101, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "#fff", width: "250px", padding: "20px", fontFamily: "monospace", boxShadow: "0 0 20px #000" }}>
             <h3 style={{ textAlign: "center", borderBottom: "1px dashed #000", paddingBottom: "10px", margin: 0 }}>收款单</h3>
             <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0" }}>
               <span>总计</span>
               <span style={{ fontSize: "20px", fontWeight: "bold", color: "#d00" }}>¥{total.toFixed(2)}</span>
             </div>
             <p style={{ textAlign: "center", fontSize: "12px", color: "#b00" }}>仅收现金 / 概不赊账</p>
             <p style={{ textAlign: "center", fontSize: "10px", color: "#ccc", marginTop: "20px" }}>（点击支付）</p>
          </div>
        </div>
      )}

      {/* --- 遷移アニメーション用要素 --- */}

      {/* 2. GIFアニメーション (Stage 2と3の時のみ表示) */}
      {(transitionStage === 2 || transitionStage === 3) && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "#000", 
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9998 
        }}>
          <Image 
            src="/kaihei-open.gif"
            alt="Transition Animation"
            width={800} 
            height={600}
            style={{ maxWidth: "100%", height: "auto" }}
            unoptimized 
          />
        </div>
      )}

      {/* 1 & 3. 暗転用黒背景 (最前面) */}
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "#000",
        // Stage 1(最初) または Stage 3(最後) 以降は真っ黒
        opacity: (transitionStage === 1 || transitionStage >= 3) ? 1 : 0,
        pointerEvents: transitionStage !== 0 ? "all" : "none",
        // Stage 3だけアニメーションなし（0秒）でバサッと切る
        transition: (transitionStage === 3) ? "none" : "opacity 2s ease-in-out", 
        zIndex: 9999 
      }} />

    </main>
  );
}