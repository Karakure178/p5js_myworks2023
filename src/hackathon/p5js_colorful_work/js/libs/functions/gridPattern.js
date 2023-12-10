/** num個で分割したグリッドを画面いっぱいに生成する
 * @function pGrid
 * @param  {p5.Graphics} pgs - 描画用レイヤー(親元)
 * @param  {Number}      num - 画面の分割数
 * @param {string} c1 - 色1
 * @param {string} c2 - 色2
 */
export const pGrid = (pgs, p, num, c1, c2) => {
  const n1 = num + 1;
  const margin_left = pgs.width / n1 / n1;
  const margin_bottom = pgs.height / n1 / n1;
  const nw = pgs.width / n1;
  const nh = pgs.height / n1;
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const pg = p.createGraphics(nw, nh);
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);

      gridC(3, pg, p.radians(90 * (j + i)), c1, c2);
      pgs.image(pg, x, y);
    }
  }
};

/** num個で分割したグリッドをグラフィックスいっぱいに生成する
 * グリッド内に三つの丸角四角をを生成する
 * @function gridC
 * @param {Number}             num      グラフィックスの分割数
 * @param {p5.Graphics object} pg       分割するグラフィックス画面
 * @param {Number}             r        回転する角度
 * @param {string} c1 - 色1
 * @param {string} c2 - 色2
 * @private
 */
const gridC = (num, pg, r, c1, c2) => {
  pg.push();
  const n1 = num + 1;
  const margin_left = pg.width / n1 / n1;
  const margin_bottom = pg.height / n1 / n1;
  const nw = pg.width / n1;
  const nh = pg.height / n1;
  pg.fill(20);
  pg.noStroke();
  pg.translate(pg.width / 2, pg.height / 2);
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < 1; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      pg.push();
      pg.rotate(r);
      if (i + 1 === num) {
        pg.fill(c1);
        pg.rect(x - pg.width / 2, y - pg.height / 2, nw, pg.height - nh, 20);
      } else {
        pg.fill(c2);
        pg.rect(x - pg.width / 2, y - pg.height / 2, nw, pg.height - nh / 2, 20);
      }
    }
    pg.pop();
  }
  pg.pop();
};
