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
 * @param  {string}        c1       色1
 * @param  {string}        c2       色2
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
