import fs from './shader/normal.frag';
import vs from './shader/normal.vert';

/**
 * shader&base テンプレ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg, pg2;
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
    pg = p.createGraphics(p.width, p.height);
    pg2 = p.createGraphics(p.width, p.height);
    image_init(pg, p);
    image_init(pg2, p);
  };

  p.draw = () => {
    p.background(110);
    p.push();
    p.translate(0 + 15, -p.height / 2 + 15); // base,base2のnum/2足す

    base(pg, 30);
    glitch(p, pg, 50, 10);
    p.pop();

    p.push();
    base2(pg2, 30);
    p.image(pg2, 0, 0);
    p.pop();

    p.noLoop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
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
  //pg.background(110);
  pg.fill(255);
  pg.noStroke();
};

const glitch = (p, pg, num, h) => {
  let switching;
  for (let i = 0; i < num; i++) {
    const t = p.height / num;
    let img = pg.get(0, i * t, pg.width, h);
    if (i % 2 === 0) {
      p.image(img, 0, i * t);
    } else {
      switching = p.random(-2, 2);
      if (switching > 0) {
        p.image(img, p.random(0, 5), i * t);
      } else {
        p.image(img, -p.random(0, 5), i * t);
      }
    }
  }
};

const base = (p, num) => {
  const n = p.width / num;
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      if (p.random(1) < 0.5) {
        p.fill(0);
      } else {
        p.fill(255);
      }
      p.rect(i * n, j * n, n, n);
    }
  }
};

const base2 = (p, num) => {
  const n = p.width / num;
  for (let i = 0; i < num; i++) {
    if (p.random(1) < 0.3) {
      p.fill(p.random(70, 255));
      const rand = parseInt(p.random(n, n * num));
      p.rect(0, i * n, rand, n);
    }
  }
};
