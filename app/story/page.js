// app/story/page.js
import Link from 'next/link';
import styles from './story.module.css'; // ← CSSファイルを読み込み

export default function Story() {
  return (
    <main style={{ 
      backgroundColor: "#080808",
      minHeight: "100vh", 
      color: "#ccc", 
      fontFamily: "'Yu Mincho', 'Hiragino Mincho ProN', serif",
      overflowX: "hidden",
      position: "relative"
    }}>
      
      {/* 閉じるボタン */}
      <div style={{ position: "fixed", top: "30px", right: "30px", zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: "none", color: "#444", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
          × 喫煙終了
        </Link>
      </div>

      {/* 小説本文エリア：CSS Modulesのクラスを適用 */}
      <div className={styles.container}>
        
        {/* 縦書きのコンテナ：CSS Modulesのクラスを適用 */}
        <article className={styles.article}>
          
          <h1 style={{ fontSize: "1.8rem", margin: "0 0 60px 40px", color: "#fff" }}>
            煙の行方
          </h1>

          <p>
            火をつけても、煙は出ない。<br />
            それでも男は深く息を吸い込み、肺の奥底にある澱（おり）のようなものを探った。
          </p>
          <p style={{ marginTop: "40px" }}>
            「ここは路地裏のフィルターだ」と誰かが言った。<br />
            世界中のノイズを濾過して、残った静寂だけを売る店だと。
          </p>
          <p style={{ marginTop: "40px" }}>
            手の中にあるのは、石と漆で作られた偽物のタバコ。<br />
            けれど、この冷たい感触だけが、今の僕にとっての唯一の現実だった。<br />
            画面の向こうでは、焚き火がパチパチと音を立てている。
          </p>
          
          <p style={{ marginTop: "60px", fontSize: "0.9rem", color: "#666" }}>
            （続く...）
          </p>

        </article>

      </div>

      {/* 雰囲気作りのための「煙」のような装飾 */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "150px",
        background: "linear-gradient(to top, #080808, transparent)",
        pointerEvents: "none"
      }}></div>

    </main>
  );
}