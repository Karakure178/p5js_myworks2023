import gsap from 'gsap';
import fs from './shader/normal.frag';
import vs from './shader/normal.vert';

/**
 * shaderお試し アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let theShader1;
  let w;

  p.setup = () => {
    const init = () => {
      const canvasid = document.getElementById('mycanvas');
      canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
      canvas.parent(canvasid);
      p.imageMode(p.CENTER);
      p.textureMode(p.NORMAL);
      p.frameRate(24);
      p.noStroke();
    };
    init();

    w = p.width;
    pg = p.createGraphics(w, w);
    image_init(pg, p);

    theShader1 = p.createShader(vs, fs);
  };

  p.draw = () => {
    p.background(110);

    p.push();
    tile8(pg, pg.width / 4);

    const shaderImage = () => {
      p.shader(theShader1);
      theShader1.setUniform(`u_tex`, pg);
      theShader1.setUniform('u_resolution', [pg.width, pg.height]);
      theShader1.setUniform(`u_time`, -p.frameCount / 35);
    };
    shaderImage();

    p.image(pg, 0, 0);
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_1tile', 'png');
      // p.saveGif('p5js_rect-wave2', 4);
    }
  };
};

/** pgの初期化関数
 * @function image_init
 * @param {p5.Graphics} pg - p5.Graphics
 * @param {p5.canvas} p - p5インスタンス
 */
const image_init = (pg, p) => {
  pg.rectMode(p.CENTER);
  pg.background(110);
  pg.fill(255);
  pg.noStroke();
};

/** タイル用の一つの模様を描く
 * 角を曲げる
 * 特徴が三角形で描画しているので線がかけない
 * @function tile8
 * @param {pg.Graphics} pg
 * @param {number} w - 四角の幅と高さ（共通量）
 */
const tile8 = (pg, w = pg.width / 4) => {
  pg.push();
  pg.fill(255);
  pg.translate(pg.width / 2, pg.height / 2);

  // 回りの模様
  const angle = 90;
  pg.push();
  pg.rect(pg.width / 2, 0, w * 2, w);
  pg.rotate(pg.radians(angle * 1));
  pg.rect(pg.width / 2, 0, w * 2, w);
  pg.pop();

  pg.push();
  pg.rect(w, w, w, w);
  pg.rect(w / 2, w / 2, w, w);

  pg.pop();

  pg.pop();
};
