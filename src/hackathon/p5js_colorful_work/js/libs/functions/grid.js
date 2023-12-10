/** num個で分割したグリッドを画面いっぱいに生成する
 * @method grid
 * @param {p5.Graphics} pg - 描画用レイヤー
 * @param {Number} num - 画面の分割数
 */
export const grid = (pg, num, c1, c2) => {
  // ランダムパターンを入れ込む
  const random = Math.floor(pg.random(1, 4));

  pg.push();
  pg.rectMode(pg.CENTER);
  const n1 = num + 1;

  const margin_left = pg.width / n1 / n1;
  const margin_bottom = pg.height / n1 / n1;

  const nw = pg.width / n1;
  const nh = pg.height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      pg.fill(c2);
      switch (random) {
        case 1:
          // #風
          if (i % 2 === 0 && j % 2 === 0) pg.fill(c1);
          break;
        case 2:
          // ボーダー風
          if (j % 2 === 0) pg.fill(c1);
          break;
        default:
          // 交互
          if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) pg.fill(c1);
      }
      pg.rect(x + nw / 2, y + nw / 2, nw, nh);
    }
  }
  pg.pop();
};
