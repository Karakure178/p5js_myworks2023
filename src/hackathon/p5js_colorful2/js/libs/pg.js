/** 分割/座標保存/番号振り分け(関数実行用)
 * @function gridPosition
 * @param {p5} p - The p5.js instance.
 * @param  {Number} s - 画面の分割数
 * @return {Object} pg_group - 分割した画面の座標と番号,color配列
 */
export const gridPosition = (p, s, c) => {
  const pgs = []; //pg保存用
  const pgs_erase = []; //pgでくり抜き用
  const res = []; //座標保存用
  const randoms = []; //ランダムな番号振り分け用
  const colors = [];
  let x, y;

  if (p.width < p.height) {
    x = p.width / s;
    y = x;
  } else {
    x = p.height / s;
    y = x;
  }

  for (let i = 0; i < s; i++) {
    for (let j = 0; j < s; j++) {
      const color = p.random(c);

      // colorを重複させないように処理
      const newC = c.filter((item) => {
        return item !== color;
      });

      const pg = image_init(p, x, x, color[0]);
      const pg_erase = image_init(p, x, x, color[0]);
      pgs.push(pg);
      pgs_erase.push(pg_erase);
      res.push(p.createVector(x * i, y * j));

      // TODO関数用に書く
      const random = Math.floor(p.random(1, 10));
      randoms.push(random);
      colors.push(color);
      c = newC;
    }
  }

  /** createGraphicsの初期設定object
   * @type {{pgs:Array,pgs_erase:Array,res:Array,rand:Array,colors:Array}}
   */
  const pg_group = {
    pgs: pgs,
    pgs_erase: pgs_erase,
    res: res,
    rand: randoms,
    colors: colors,
  };
  console.log(c);

  return pg_group;
};

/** createGraphicsの初期設定
 * @function gridPosition
 * @param {p5} p - The p5.js instance.
 * @param {number} w - 描画用レイヤーの幅w
 * @param {number} h - 描画用レイヤーの高さh
 * @param {string} c - 背景のカラーコード
 * @return {p5.Graphics} pg - 描画用レイヤー
 */
const image_init = (p, w, h, c) => {
  const pg = p.createGraphics(w, h);
  pg.background(c);
  pg.strokeWeight(3);
  pg.noStroke();
  pg.fill('#776B5D');
  return pg;
};
