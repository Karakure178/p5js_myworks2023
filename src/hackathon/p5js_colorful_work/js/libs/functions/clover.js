/**
 * num個で分割したグリッドを画面いっぱいに生成する
 * クローバーをグリッドに配置する
 * @function cloverGrid
 * @param {p5.Graphics}   pg - 描画用レイヤー
 * @param {p5}            p - p5インスタンス
 * @param {Number}        num      画面の分割数
 */
export const cloverGrid = (pgs, p, num, c1, c2) => {
  const randColor = Math.floor(p.random(0, 2));
  const n1 = num + 1;
  const margin_left = pgs.width / n1 / n1;
  const margin_bottom = pgs.height / n1 / n1;

  const nw = pgs.width / n1;
  const nh = pgs.height / n1;
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      pgs.push();
      pgs.translate(x + nw / 2, y + nh / 2);
      pgs.rotate(p.PI / 10);
      if (randColor === 0) {
        clover(pgs, p, nw / 3, c1);
      } else {
        clover(pgs, p, nw / 3, c2);
      }
      pgs.pop();
    }
  }
};

/** cloverを書くための関数
 * @method clover
 * @param {p5.Graphics}   pg - 描画用レイヤー
 * @param {p5}            p - p5インスタンス
 * @param {Number}        size        クローバーのサイズ
 * @param {string}      color       p5jsで使うカラーコード
 */
const clover = (pg, p, size, color) => {
  // 移動量設定
  const w = (size / 5) * 3;
  const hTop = (size / 5) * 2;
  const hDown = (size / 5) * 4;

  // 全体設定
  pg.push();
  pg.rectMode(p.CENTER);
  pg.fill(color);

  // 上段
  pg.push();
  pg.translate(w, -hTop);
  pg.circle(0, -size / 2, size);
  pg.circle(size / 2, 0, size);
  pg.rect(0, 0, size, size);
  pg.pop();

  pg.scale(-1, 1);

  pg.push();
  pg.translate(w, -hTop);
  pg.circle(0, -size / 2, size);
  pg.circle(size / 2, 0, size);
  pg.rect(0, 0, size, size);
  pg.pop();

  pg.scale(1, 1);
  pg.rotate(p.PI);

  // 以降下段
  pg.push();
  pg.translate(w, -hDown);
  pg.circle(0, -size / 2, size);
  pg.circle(size / 2, 0, size);
  pg.rect(0, 0, size, size);
  pg.pop();

  pg.scale(-1, 1);

  pg.push();
  pg.translate(w, -hDown);
  pg.circle(0, -size / 2, size);
  pg.circle(size / 2, 0, size);
  pg.rect(0, 0, size, size);
  pg.pop();

  pg.pop();
};
