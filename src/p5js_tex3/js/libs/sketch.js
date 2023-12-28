import gsap from 'gsap';
import fs_meta from './shader/metaball.frag';
import fs_highline from './shader/highline.frag';
import vs from './shader/normal.vert';

/**
 * shader アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg, pg2;
  let theShader1; // sin wave
  let theShader2; // 高等線

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    p.imageMode(p.CENTER);
    p.textureMode(p.NORMAL);
    p.frameRate(24);
    p.noStroke();
    theShader1 = p.createShader(vs, fs_meta);
    theShader2 = p.createShader(vs, fs_highline);

    pg = p.createGraphics(p.width, p.height);
    image_init(p, pg);

    pg2 = p.createGraphics(p.width, p.height);
    image_init(p, pg2);
  };

  p.draw = () => {
    p.background(110);
    p.translate(-p.width / 2, -p.height / 2);

    paint_pg(p, pg2, theShader2, 0, 0, false, pg2);

    // これうまくいってない,描画処理されたものでない
    paint_pg(p, pg, theShader1, 0, 0, false, pg2);
    // 上から重ねて描画用処理
    p.push();
    p.fill(210);
    p.circle(p.width / 2, p.height / 2, 100);
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_rect-wave2', 4);
    }
  };
};

/** カラーコードを0-1の配列に変換する
 * @method rand_color
 * @param  {string}        colorCode          カラーコード
 */
const rand_color = (colorCode) => {
  let rc = p.color(colorCode);
  return [p.red(rc) / 255.0, p.green(rc) / 255.0, p.blue(rc) / 255.0];
};

const image_init = (p, pg) => {
  pg.rectMode(p.CENTER);
  pg.background(100);
  pg.fill(255);
  pg.stroke(255);
};

/** num個で分割したグリッドを画面いっぱいに生成する
 * @method grid
 * @param  {Number}        num           画面の分割数
 * @param  {p5.Graphics}   pg          image用のpg
 */
const grid = (p, num, pg) => {
  const n1 = num + 1;

  const margin_left = p.width / n1 / n1;
  const margin_bottom = p.height / n1 / n1;

  const nw = p.width / n1;
  const nh = p.height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      pg.circle(x + nw / 2, y + nw / 2, nw);
    }
  }
};

/**シェーダーを使うイメージ描画用処理
 * @method paint_pg
 * @param  {p5} p - The p5.js instance.
 * @param  {p5.Graphics}   pg          image用のpg
 * @param  {p5.Shader}     theShader - 画面の分割数
 * @param  {Number}        x - 配置したいx座標
 * @param  {Number}        y - 配置したいy座標
 */
const paint_pg = (p, pg, theShader, x, y, bool, tex) => {
  pg.clear();
  p.push();
  pg.push();
  //pg.translate(pg.width / 2, pg.height / 2);
  if (bool) grid(p, 10, pg);
  pg.pop();

  p.shader(theShader);
  theShader.setUniform(`u_tex`, tex);
  theShader.setUniform('u_resolution', [pg.width, pg.height]);
  theShader.setUniform(`u_time`, -p.frameCount / 35);
  p.image(pg, x + p.width / 2, y + p.height / 2);
  p.pop();
};
