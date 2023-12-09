import p5 from 'p5';
/** 分割/座標保存/番号振り分け(関数実行用)
 * @function gridPosition
 * @param  {Number} s - 画面の分割数
 * @return {Object} pg_group - 分割した画面の座標と番号
 */
export const gridPosition = (s) => {
  const pgs = []; //pg保存用
  const res = []; //座標保存用
  const randoms = []; //ランダムな番号振り分け用
  let x, y;

  if (width < height) {
    x = width / s;
    y = x;
  } else {
    x = height / s;
    y = x;
  }

  for (let i = 0; i < s; i++) {
    for (let j = 0; j < s; j++) {
      //pg.rect(x*i,y*j,x,x);
      const pg = image_init(x, x);
      pgs.push(pg);
      res.push(p5.createVector(x * i, y * j));

      // TODO関数用に書く
      const random = Math.floor(p5.random(1, s));
      randoms.push(random);
    }
  }

  /** createGraphicsの初期設定object
   * @type {{pgs:Array,res:Array,rand:Array}}
   */
  const pg_group = {
    pgs: pgs,
    res: res,
    rand: randoms,
  };

  return pg_group;
};

/** createGraphicsの初期設定
 * @function gridPosition
 * @param {number} w - 描画用レイヤーの幅w
 * @param {number} h - 描画用レイヤーの高さh
 * @return {p5.Graphics} pg - 描画用レイヤー
 */
const image_init = (w, h) => {
  const pg = createGraphics(w, h);
  pg.background(220);
  pg.stroke(20);
  pg.strokeWeight(3);
  pg.background(220); // 透明にしたい場合はコメントアウト
  pg.noStroke();
  pg.fill('#776B5D');
  //pg.rectMode(p.CENTER);
  return pg;
};
