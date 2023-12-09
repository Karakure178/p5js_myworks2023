/** 大き目の円を生成する
 * @function circles
 * @param {p5.Graphics} pg - 描画用レイヤー
 * @param {Number} p - 画面の分割数
 * @param {string} c1 - 色1
 * @param {string} c2 - 色2
 */
export const circles = (pg, p, c1, c2) => {
  pg.push();
  const randX = p.random(0, pg.width);
  const randY = p.random(0, pg.height);
  const randR = p.random(300, pg.width * 2);
  const num = 10;
  let diameter = randR;
  for (let i = num; i > 0; i--) {
    let pct = i / num;
    pct = p.pow(pct, 2);
    let d = pct * diameter;
    const color_mix = p.lerpColor(p.color(c2), p.color(c1), num / d);
    pg.fill(color_mix);
    pg.circle(randX, randY, d);
    pg.drawingContext.filter = 'drop-shadow(1px 2px 1px rgb(255,255,255))';
  }
  pg.pop();
};
