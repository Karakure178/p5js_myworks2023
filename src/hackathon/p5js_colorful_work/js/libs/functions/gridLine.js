/**
 * 格子状に線かエビっぽいマークを描く関数
 * @function gridLine
 * @param {p5.Graphics} pg - 描画用レイヤー
 * @param {p5} p - p5インスタンス
 * @param {string} c1 - 色1
 * @param {string} c2 - 色2
 */
export const gridLine = (pg, p, c1, c2) => {
  const w = p.sqrt(p.sq(pg.width) + p.sq(pg.height));

  pg.push();
  pg.angleMode(p.DEGREES);
  pg.translate(pg.width / 2, pg.height / 2);
  pg.rotate(p.random(360));
  pg.translate(-w / 2, -w / 2);

  // だし分け用
  // 1: エビ、2: 線
  const rand = Math.floor(p.random(1, 3));

  let cells = Math.floor(p.random(6, 8));
  let d = w / cells;
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      let x = i * d;
      let y = j * d;

      if (p.random() > 0.5) {
        switch (rand) {
          case 1:
            ebi(pg, p, x, y, x + d, y + d, c1, c2);
            break;
          default:
            pg.stroke(c1);
            pg.strokeWeight(5);
            pg.line(x, y, x + d, y + d);
            pg.line(x, y, x - d, y - d);
            pg.line(x, y, x + d, y);
            pg.line(x, y, x, y + d);
        }
      } else {
        switch (rand) {
          case 1:
            ebi(pg, p, x, y, x - d, y - d, c1, c2);
            break;
          default:
            pg.stroke(c1);
            pg.strokeWeight(5);
            pg.line(x + d, y, x, y - d);
            pg.line(x - d, y, x, y + d);
            pg.line(x, y + d, x + d, y);
            pg.line(x, y - d, x - d, y);
        }
      }
    }
  }
  pg.pop();
};

/**
 * エビっぽいマークを描く
 * @function ebi
 * @param {p5.Graphics} pg - 描画用レイヤー
 * @param {p5} p - p5インスタンス
 * @param {number} x - 最初の座標x
 * @param {number} y - 最初の座標y
 * @param {number} xx - 最後の座標x
 * @param {number} yy - 最後の座標y
 * @param {string} c1 - 色1
 * @param {string} c2 - 色2
 */
const ebi = (pg, p, x, y, xx, yy, c1, c2) => {
  const dis = p.dist(x, y, xx, yy);
  let angle = p.atan2(yy - y, xx - x);

  pg.push();
  pg.translate(x, y);
  pg.rotate(angle);
  let n = 0;
  while (n < dis) {
    pg.push();
    const color_mix = p.lerpColor(p.color(c1), p.color(c2), n / dis);
    pg.fill(color_mix);
    pg.translate(n / 2, 0);
    pg.rotate(n);
    pg.circle(n, 0, n / 3);
    n += 1;
    pg.pop();
  }
  pg.pop();
};
