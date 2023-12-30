import gsap from 'gsap';

/**
 * タイル上に並ぶ図形スケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let w;
  let n;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    //p.imageMode(p.CENTER);
    p.textureMode(p.NORMAL);
    p.frameRate(24);
    p.noStroke();

    w = p.width;
    n = 5;
    pg = p.createGraphics(w / n, w / n);
    image_init(pg, p);
  };

  p.draw = () => {
    p.background(110);
    p.translate(-p.width / 2, -p.height / 2);

    p.push();
    for (let i = 0; i < n; i++) {
      const x = p.map(i, 0, n, 0, p.width);
      for (let j = 0; j < n; j++) {
        const y = p.map(j, 0, n, 0, p.height);
        drawCircles(pg);
        p.image(pg, x, y);
      }
    }
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_pattern1', 'png');
      p.saveGif('p5js_pattern1', 4);
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
  //pg.background(100);
  pg.fill(255);
  pg.noStroke();
};

/** 四角と円を等倍幅に描く関数
 * @function drawCircles
 * @param {p5.Graphics} p - p5.Graphics
 */
const drawCircles = (p) => {
  let num = 10;
  let diameter = p.width / 2;
  const s = p.random(1, 2);
  for (let i = num; i > 0; i--) {
    let d = (i * diameter) / num;
    drawRect(p, d);
    if (i % 2 === 0) {
      p.fill(255);
    } else {
      p.fill('#234657');
    }
    circles(p, d * s);
  }
};

/** 円を四隅に描く関数
 * @function circles
 * @param {p5.Graphics} p - p5.Graphics
 * @param {number} w - 幅
 */
const circles = (p, w) => {
  p.push();
  p.translate(p.width / 2, p.height / 2);

  p.circle(-p.width / 2, -p.height / 2, w);
  p.circle(p.width / 2, -p.height / 2, w);
  p.scale(1, -1);
  p.circle(-p.width / 2, -p.height / 2, w);
  p.circle(p.width / 2, -p.height / 2, w);
  p.pop();
};

/** 中央に四角を描く関数
 * @function drawRect
 * @param {p5.Graphics} p
 * @param {number} w
 */
const drawRect = (p, w) => {
  const t = p.random(1, 2);
  p.rect(p.width / 2, p.height / 2, w * t, w * t);
};
