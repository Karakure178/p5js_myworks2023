import { recter } from './recter.js';
/** num個で分割したグリッドを画面いっぱいに生成する
 * 四角の中に縞々が入る
 * @method grid
 * @param  {Number}        num           画面の分割数
 */
export const grid = (p, num, pg) => {
  const colors = ['#A94438', '#D24545', '#E6BAA3', '#E4DEBE', '#F8F4EC', '#FF9BD2', '#D63484', '#402B3A'];
  const n1 = num + 1;

  const margin_left = pg.width / n1 / n1;
  const margin_bottom = pg.height / n1 / n1;

  const nw = pg.width / n1;
  const nh = pg.height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      pg.push();
      pg.translate(x, y);
      const rand_colors = [
        colors[Math.floor(Math.random() * colors.length)],
        colors[Math.floor(Math.random() * colors.length)],
      ];
      recter(pg, rand_colors, nw, nh * Math.floor(p.random(5, 10)), Math.floor(p.random(5, 30)));
      //recter(pg, rand_colors, nw, nh, 5);

      pg.pop();

      //   pg.push();
      //   pg.noFill();
      //   pg.stroke(0);
      //   pg.strokeWeight(2);
      //   pg.rect(x + nw / 2, y + nw / 2, nw, nw);
      //   pg.pop();
    }
  }
};

/** num個で分割したグリッドを画面いっぱいに生成する
 * ストローク限定のやつ
 * @method grid
 * @param  {Number}        num           画面の分割数
 */
export const strokeGrid = (num, pg, color) => {
  const n1 = num + 1;

  const margin_left = pg.width / n1 / n1;
  const margin_bottom = pg.height / n1 / n1;

  const nw = pg.width / n1;
  const nh = pg.height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);

      pg.push();
      pg.noFill();
      pg.stroke(color);
      pg.strokeWeight(4);
      pg.rect(x, y, nw, nw);
      pg.pop();
    }
  }
};
