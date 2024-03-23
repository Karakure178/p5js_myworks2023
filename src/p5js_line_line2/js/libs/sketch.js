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
    p.background('#F0F0F0');

    p.push();
    pg.fill('#FFC436');
    widthGrid(p, pg, 20, p.PI / 2);

    pg.fill('#0C356A');
    widthGrid(p, pg, 20, 0);

    pg.fill('#F45050');
    widthGrid(p, pg, 20, -p.PI / 2);

    pg.fill('#90D26D');
    widthGrid(p, pg, 20, -p.PI);

    p.image(pg, 0, 0);
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
  //pg.rectMode(p.CENTER);
  //pg.background(110);
  pg.fill(255);
  //pg.stroke(9);
  pg.noStroke();
};

const widthGrid = (p, pg, num, angle) => {
  const w = pg.width / (num * 2);
  for (let j = 0; j < num * 2; j++) {
    pg.push();
    if (j % 2 == 0) {
      pg.translate(pg.width / 2, pg.height / 2);
      pg.rotate(angle);
      pg.rect(p.random(0, pg.width) - pg.width / 2, j * w - pg.height / 2, pg.width, w);
    }
    pg.pop();
  }
};
