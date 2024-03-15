import gsap from 'gsap';

/**
 * shader&base テンプレ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;

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

    pg = p.createGraphics(p.width, p.height);
    image_init(pg, p);
  };

  p.draw = () => {
    pg.background(220);

    p.push();
    pg.push();
    sins(pg, p);
    multiLine(pg, p);
    pg.pop();

    p.image(pg, 0, 0);
    p.pop();

    p.noLoop();
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
  //pg.rectMode(p.CENTER);
  pg.background(110);
  pg.fill(255);
  pg.noStroke();
};

function sins(pg, p) {
  const n = 40;
  for (let i = pg.height / n; i > 0; i--) {
    if (p.random(1) < 0.5) {
      const color = p.map(i, 0, pg.height / n, 0, 255);
      multiSin(n * i, color, pg, p);
    }
  }
}

const multiLine = (pg, p) => {
  const n = 50;
  const h = p.height / n;
  for (let i = 0; i < n; i++) {
    if (p.random(2, 5) < 3) {
      if (i % 2 === 0) {
        pg.fill(0);
      } else {
        pg.fill(255);
      }
      pg.rect(0, h * i, p.width, h);
    }
  }
};

const multiSin = (h, color, pg, p) => {
  const r = 100;

  pg.push();
  pg.fill(color);
  pg.translate(0, h);
  pg.beginShape();
  pg.vertex(0, -h);

  for (let i = 0; i < pg.width; i++) {
    const y = r * p.sin(p.radians(i));
    pg.vertex(i, y);
  }

  pg.vertex(pg.width, -h);
  pg.endShape(p.CLOSE);
  pg.pop();
};
