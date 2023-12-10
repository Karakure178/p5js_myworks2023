/**
 * サインカーブを描画してもらって焼きこむ関数
 * @function sinWave
 * @param  {p5.Graphics}   pgs      描画用レイヤー
 * @param  {p5}            p        p5インスタンス
 * @param  {Number}        sw       最小幅
 * @param  {Number}        sh       最小高さ
 * @param  {Number}        w        最大幅
 * @param  {Number}        h        最大高さ
 * @param  {Number}        t        sinカーブの隙間
 */
export const sinWave = (pgs, p, sw, sh, w, h, t, c1, c2) => {
  const pg = p.createGraphics(w, h);
  pg.noStroke();
  const fre = Math.floor(p.random(2, 10));

  for (let i = 0; i < 8; i++) {
    const r = 30;
    const maxH = sh + t * i;

    pg.push();
    pg.beginShape();
    pg.vertex(sw, maxH);
    pg.fill(c2);
    if (i % 2 === 0) pg.fill(c1);

    for (let i = 0; i < w; i += 5) {
      const y = r * p.sin(p.radians(i * fre)) + maxH;
      const x = i;
      pg.vertex(x, y);
    }

    pg.vertex(w, maxH);
    pg.endShape(p.CLOSE);
    pg.pop();
  }
  pgs.image(pg, sw, sh);
};

/**
 * サインカーブそのものを描画する関数
 * @function base
 * @param  {p5.Graphics}   pg      描画用レイヤー
 * @param  {p5}            p       p5インスタンス
 * @param  {Number}        r       sinの波の大きさ
 * @param  {Number}        fre     角振動数
 * @param  {p5.color}      color   color変数
 * @param  {Number}        sw      最小幅
 * @param  {Number}        w       最大幅
 * @param  {Number}        h       最大高さ
 * @private
 */
function base(pg, p, r, fre, color, sw, w, h) {
  // pg.push();
  pg.beginShape();
  // pg.vertex(sw, h);
  // pg.fill(color);
  // for (let i = 0; i < w; i += 5) {
  //   const y = r * p.sin(p.radians(i * fre)) + h;
  //   const x = i;
  //   pg.vertex(x, y);
  // }
  // pg.vertex(w, h);
  pg.endShape(p.CLOSE);
  // pg.pop();
}
