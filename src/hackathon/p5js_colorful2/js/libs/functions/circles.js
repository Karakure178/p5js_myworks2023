/** 大き目の円を生成する
 * @function circles
 * @param {p5.Graphics} pg - 描画用レイヤー
 * @param {p5} p - p5インスタンス
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
    pg.fill(c2);
    if (i % 2 === 0) pg.fill(c1);

    pg.circle(randX, randY, d);
    pg.drawingContext.filter = 'drop-shadow(1px 2px 1px rgb(255,255,255))';
  }
  pg.pop();
};
