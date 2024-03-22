import * as brush from 'p5.brush';

/**
 * shader&base テンプレ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  brush.instance(p);

  p.setup = () => {
    const init = () => {
      const canvasid = document.getElementById('mycanvas');
      canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
      canvas.parent(canvasid);
      p.imageMode(p.CENTER);
      p.textureMode(p.NORMAL);
      p.frameRate(24);
    };
    init();

    pg = p.createGraphics(p.width, p.height);
    image_init(pg, p);
    p.background(220);
  };

  p.draw = () => {
    p.push();
    p.translate(-p.width / 2, 0);
    p.fill(255);
    sinCurve(p);
    p.pop();

    setTimeout(() => {
      p.push();
      p.translate(-p.width / 2, -p.height / 2);
      brush.noStroke();
      widthGrid_brush(p, 10);
      p.pop();

      p.push();
      p.translate(-p.width / 2, -p.height / 2);
      widthGrid(p, 140, 50);
      p.pop();

      p.noLoop();
    }, '0');
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      ///p.saveGif('p5js_rect-wave2', 4);
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

/** widthをnum分分割した線を描く
 * @function widthGrid
 * @param {p5.canvas} p - p5インスタンス
 * @param {number} num - 分割数
 */
const widthGrid = (p, num, alpha) => {
  //p.stroke(9);
  // p.noFill();
  const w = p.width / num;
  const h = p.width / (num * 1);
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      p.fill(p.random(255), p.random(255), p.random(255), alpha);
      p.rect(i * w, j * w, w, w);
    }
  }
};

/** widthをnum分分割した線を描く.brush用
 * @function widthGrid_brush
 * @param {p5.canvas} p - p5インスタンス
 * @param {number} num - 分割数
 */
const widthGrid_brush = (p, num) => {
  const w = p.width / num;
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      p.fill(p.random(255), p.random(255), p.random(255), 100);
      if (p.random(1) > 0.5) {
        brush.fill('#2B2E4A', p.random(30, 140));
      } else {
        brush.fill('#E84545', p.random(30, 140));
      }
      brush.rect(i * w, j * w, w, w);
    }
  }
};

/** widthをnum分分割した線を描く.brush用
 * @function sinCurve
 * @param {p5.canvas} p - p5インスタンス
 */
const sinCurve = (p) => {
  const r = 70;
  const k = 0;
  brush.fill('#53354A', p.random(100, 140));
  brush.noStroke();
  brush.beginShape();
  brush.vertex(0, -p.height);
  for (let i = 0; i < p.width; i++) {
    const x = i;
    const y = r * (p.sin(0.03 * i + k) + p.sin(0.02 * i + k * 1.2));
    brush.vertex(x, y);
  }
  brush.vertex(p.width + 100, -p.height);
  brush.endShape(p.CLOSE);
};
