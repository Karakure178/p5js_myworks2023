import gsap from 'gsap';
import fs from './shader/inversion.frag';
import vs from './shader/normal.vert';
import { Tile } from './shape/tile';

/**
 * shaderお試し アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg, pg2;
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
    pg = p.createGraphics(w / 2, w / 2);
    pg2 = p.createGraphics(w / 2, w / 2);
    image_init(pg);
    image_init(pg2);

    theShader1 = p.createShader(vs, fs);
  };

  p.draw = () => {
    p.background(220);

    p.push();
    pg.push();
    drawTile(pg, 10);
    pg.pop();

    pg2.push();
    drawTile(pg2, 10);
    pg2.pop();

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_tex2`, pg2);
    theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    p.image(pg, -p.width / 4, -p.height / 4);
    p.image(pg, p.width / 4, p.height / 4);
    p.pop();
    p.noLoop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_rect-wave2', 4);
    }
  };

  /**
   * pgの初期化
   * @function image_init
   */
  const image_init = (pg) => {
    pg.rectMode(p.CENTER);
    pg.background(100);
    pg.fill(255);
    pg.stroke(255);
  };

  /**
   * ランダムな変数によって向きが変わるタイルを描画する
   * @function drawTile
   * @param {p5.Graphics} pg
   */
  const drawTile = (pg, tile_num) => {
    const tile_w = pg.width / tile_num;
    const tile_h = pg.height / tile_num;
    const tile_margin = 0;
    const tile_wm = tile_w - tile_margin;
    const tile_hm = tile_h - tile_margin;
    const tile_w2 = tile_w / 2;
    const tile_h2 = tile_h / 2;

    for (let j = 0; j < tile_num; j++) {
      for (let i = 0; i < tile_num; i++) {
        const x = tile_w * i + tile_w2;
        const y = tile_h * j + tile_h2;
        const tile = new Tile(pg, x, y, tile_wm, tile_hm);
        tile.randRect();
      }
    }
  };
};
