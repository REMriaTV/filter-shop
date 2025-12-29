"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- モニターコンポーネント（既存のまま）---

// --- 受付メイン ---
export default function Reception() {
  
  // ★詳細なデバッグを追加
  useEffect(() => {
    console.log('=== モニタールームデバッグ開始 ===');
    console.log('1. 現在のURL:', window.location.href);
    console.log('2. ページがリロードされてきたか:', performance.navigation.type);
    console.log('3. bodyの子要素数:', document.body.children.length);
    
    // すべての要素を詳細に調査
    const allElements = document.querySelectorAll('*');
    console.log('4. DOM内の全要素数:', allElements.length);
    
    // トップページの要素を探す
    const topPageElements = Array.from(allElements).filter(el => {
      const style = window.getComputedStyle(el);
      return (
        style.backgroundColor.includes('187, 0, 0') || 
        style.backgroundColor.includes('#b00') ||
        style.color.includes('255, 255, 0') ||
        style.color.includes('#ff0')
      );
    });
    
    console.log('5. トップページの要素（赤/黄色）:', topPageElements.length);
    topPageElements.forEach((el, i) => {
      console.log(`   要素 ${i}:`, {
        タグ: el.tagName,
        親要素: el.parentNode?.tagName,
        位置: `${el.offsetTop}px, ${el.offsetLeft}px`,
        表示状態: el.style.display || 'default',
        背景色: window.getComputedStyle(el).backgroundColor
      });
    });
    
    // bodyとhtmlのスタイルを確認
    console.log('6. bodyのスタイル:', {
      backgroundColor: document.body.style.backgroundColor,
      computedBackgroundColor: window.getComputedStyle(document.body).backgroundColor
    });
    
    console.log('7. htmlのスタイル:', {
      backgroundColor: document.documentElement.style.backgroundColor,
      computedBackgroundColor: window.getComputedStyle(document.documentElement).backgroundColor
    });
    
    // 強制的なクリーンアップ
    console.log('8. 強制クリーンアップ実行');
    
    // 方法1: querySelectorで直接削除
    const restaurantHeader = document.querySelector('header');
    if (restaurantHeader) {
      console.log('  ヘッダー要素を発見、削除します');
      restaurantHeader.style.display = 'none';
      restaurantHeader.style.visibility = 'hidden';
      restaurantHeader.style.opacity = '0';
      restaurantHeader.style.position = 'absolute';
      restaurantHeader.style.top = '-9999px';
      
      // 少し遅らせて完全削除
      setTimeout(() => {
        if (restaurantHeader.parentNode) {
          restaurantHeader.parentNode.removeChild(restaurantHeader);
          console.log('  ヘッダーをDOMから削除しました');
        }
      }, 100);
    }
    
    // 方法2: 赤い背景の要素をすべて非表示
    document.querySelectorAll('*').forEach(el => {
      if (el === document.body || el === document.documentElement) return;
      
      const style = window.getComputedStyle(el);
      const bgColor = style.backgroundColor;
      
      if (bgColor.includes('187, 0, 0') || bgColor.includes('#b00')) {
        console.log(`  赤い要素を非表示: ${el.tagName}`);
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.style.position = 'absolute';
        el.style.top = '-9999px';
      }
    });
    
    // 方法3: bodyを完全に黒く
    document.body.style.backgroundColor = '#000';
    document.body.style.color = '#fff';
    document.documentElement.style.backgroundColor = '#000';
    
    // 方法4: CSSルールを追加
    const style = document.createElement('style');
    style.id = 'force-black-styles';
    style.textContent = `
      /* 強制的にすべてを黒く */
      html, body {
        background-color: #000 !important;
        color: #fff !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
      }
      
      /* トップページの要素を完全に非表示 */
      header {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        top: -9999px !important;
        pointer-events: none !important;
      }
      
      /* 赤い背景の要素を非表示 */
      [style*="background: #b00"],
      [style*="background-color: #b00"],
      [style*="background: rgb(187, 0, 0)"],
      [style*="background-color: rgb(187, 0, 0)"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        top: -9999px !important;
      }
      
      /* モニタールームのコンテンツを確実に表示 */
      main {
        display: block !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log('=== モニタールームデバッグ終了 ===');
    
    return () => {
      // クリーンアップ
      const styleEl = document.getElementById('force-black-styles');
      if (styleEl) {
        document.head.removeChild(styleEl);
      }
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
    // ★変更: positionをfixedにして確実に全面に
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      overflow: 'auto',
      zIndex: 100000
    }}>
      <style jsx global>{`
        /* 絶対的なリセット */
        * {
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          background-color: #000 !important;
          color: #fff !important;
        }
        
        /* デバッグ用ボーダー */
        /* body * {
          outline: 1px solid rgba(255, 0, 0, 0.1) !important;
        } */

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

      {/* 黒い幕 */}
      <div style={{
        position: "fixed",
        top: -100, left: 0, width: "100%", height: "200vh",
        backgroundColor: "#000",
        zIndex: 99999,
        animation: "curtainFadeOut 3s ease-out forwards"
      }}></div>

      <main style={{ 
        backgroundColor: "#000", 
        minHeight: "100vh", 
        padding: "20px", 
        color: "#fff", 
        position: "relative",
        zIndex: 1
      }}>
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
    </div>
  );
}

const styles = {
  // 既存のスタイル
};