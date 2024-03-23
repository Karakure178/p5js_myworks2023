import fs from './shader/normal.frag';
import vs from './shader/normal.vert';

/**
 * shader&base テンプレ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let theShader1;
  let rand;
  let img; // 外部テクスチャ

  p.preload = () => {
    img = p.loadImage('img/rect-test.jpg');
  };

  p.setup = () => {
    img.loadPixels();
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
    pg = p.createGraphics(p.width, p.height);
    image_init(pg, p);
    theShader1 = p.createShader(vs, fs);

    rand = p.random(1);
  };

  p.draw = () => {
    p.background(110);

    p.push();
    const colors2 = ['#FF407D', '#FFCAD4', '#40679E', '#1B3C73'];
    const num = parseInt(p.random(3, 60));
    fillHex(p, pg, colors2, num);

    const shaderImage = () => {
      p.shader(theShader1);
      theShader1.setUniform(`u_pattern`, pg);
      theShader1.setUniform(`u_tex`, img);
      theShader1.setUniform('u_resolution', [pg.width, pg.height]);
      theShader1.setUniform(`u_time`, -p.frameCount / 35);
      theShader1.setUniform(`u_color`, rand_color(p, '#FFCAD4'));
      theShader1.setUniform(`u_color2`, rand_color(p, '#FF407D'));
    };
    shaderImage();

    p.image(pg, 0, 0);
    p.pop();
    p.noLoop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_honey_shader', 'png');
      p.saveGif('p5js_rect-wave2', 4);
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

/** rgbを0~1の範囲に変換する関数
 * @function rand_color
 * @param {p5.canvas} p - p5インスタンス
 * @param  {string} colors - 色コード
 */
const rand_color = (p, colorCode) => {
  let rc = p.color(colorCode);
  return [p.red(rc) / 255.0, p.green(rc) / 255.0, p.blue(rc) / 255.0];
};

/** 六角形で塗りつぶす関数
 * @function fillHex
 * @param {p5.Graphics} pg - p5.Graphics
 * @param {p5.canvas} p - p5インスタンス
 * @param {array} colors - 色コードが入った配列
 * @param {number} num - 分割数
 */
const fillHex = (p, pg, colors, num) => {
  const w = pg.width / num;
  for (let i = 0; i < num * 2; i++) {
    for (let j = 0; j < num * 2; j++) {
      let c;
      c = p.random(colors);
      pg.fill(c);
      pg.stroke(c);
      // w/2 = rの半径
      // 1.72 = 半径を1.72分かけるとちょうどよかった
      tris(p, pg, i * (w / 2) * 1.72, j * (w / 2) * 3, w);
    }
  }
};

/** 六角形を三つくっつけて書く関数
 * @function tris
 * @param {p5.Graphics} pg - p5.Graphics
 * @param {p5.canvas} p - p5インスタンス
 * @param {number} x - 中心点x
 * @param {number} y - 中心点y
 * @param {number} r - 六角形の半径
 * @param {array} colors - num分の色コードが入った配列
 * @param {boolean} isFill - 色を塗るか否か
 */
const tris = (p, pg, x, y, r, colors, isFill) => {
  const num = 3;
  const rr = r / 2;

  const angle = 360 / num;
  pg.push();
  pg.translate(x, y);
  pg.rotate(p.radians(30));
  for (let i = 1; i < num; i++) {
    const xx = rr * p.cos(p.radians(angle * i));
    const yy = rr * p.sin(p.radians(angle * i));
    if (isFill) pg.fill(colors[i]);
    hexagon(p, pg, xx, yy, r);
  }
  pg.pop();
};

/** 六角形を書く関数
 * @function hexagon
 * @param {p5.Graphics} pg - p5.Graphics
 * @param {p5.canvas} p - p5インスタンス
 * @param {number} x - 中心点x
 * @param {number} y - 中心点y
 * @param {number} r - 六角形の半径
 */
const hexagon = (p, pg, x, y, r) => {
  const num = 6;
  const rr = r / 2;
  const angle = 360 / num;
  pg.push();
  pg.translate(x, y);
  pg.beginShape();
  for (let i = 0; i < num; i++) {
    const xx = rr * p.cos(p.radians(angle * i));
    const yy = rr * p.sin(p.radians(angle * i));
    pg.vertex(xx, yy);
  }
  pg.endShape(p.CLOSE);
  pg.pop();
};
