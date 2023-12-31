import gsap from 'gsap';
import fs from './shader/normal.frag';
import vs from './shader/normal.vert';

/**
 * shaderお試し アニメーションスケッチ
 * 参考 https://gin-graphic.hatenablog.com/entry/2021/02/11/113000
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let theShader1;
  let w;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    p.imageMode(p.CENTER);
    p.textureMode(p.NORMAL);
    p.frameRate(24);
    p.noStroke();

    w = p.width;
    pg = p.createGraphics(w, w);
    image_init(pg, p);

    theShader1 = p.createShader(vs, fs);
  };

  p.draw = () => {
    p.background(110);

    p.push();
    tile1(pg);

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
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
 * 今回は、四角メイン・真ん中に小さい四角形がある模様
 * @function tile1
 * @param {pg.Graphics} pg
 */
const tile1 = (pg) => {
  pg.push();
  pg.stroke(0);
  pg.strokeWeight(10);
  pg.fill(255);
  pg.translate(pg.width / 2, pg.height / 2);

  //pg.rect(pg.width / 2, 0, pg.width / 4, pg.height / 4); // 右真ん中端

  // 回りの模様
  for (let i = 0; i < 360 / 45; i++) {
    pg.push();
    pg.rotate(pg.radians(45 * i));
    if (i % 2 === 0) {
      pg.fill(0);
    } else {
      pg.fill(255);
    }
    pg.rect(pg.width / 2, 0, pg.width / 4, pg.height / 4);
    pg.pop();
  }

  // 真ん中の模様
  pg.push();
  pg.rect(0, 0, pg.width / 2, pg.height / 2);
  pg.rotate(pg.radians(45));
  pg.rect(0, 0, pg.width / 2, pg.height / 2);
  pg.pop();

  // 真ん中の模様（線のみ）
  // pg.push();
  // pg.noFill();
  // pg.rect(0, 0, pg.width / 2, pg.height / 2);
  // pg.rotate(pg.radians(45));
  // pg.rect(0, 0, pg.width / 2, pg.height / 2);
  // pg.pop();

  // 真ん中の模様（小さい＆黒い）
  pg.push();
  pg.stroke(255);
  pg.fill(0);
  pg.rect(0, 0, pg.width / 3, pg.height / 3);
  pg.rotate(pg.radians(45));
  pg.rect(0, 0, pg.width / 3, pg.height / 3);
  pg.pop();

  pg.pop();
};
