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
    p.background(110);

    p.push();
    pg.push();
    //pg.translate(pg.width / 2, pg.height / 2);
    colorCircle(pg, p, 5);
    pg.pop();

    p.image(pg, 0, 0);
    p.pop();
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
  pg.background(220);
  pg.fill(255);
  pg.noStroke();
};

// カラフルな円をかきたい
const colorCircle = (pg, p, num) => {
  pg.stroke(0);
  pg.noFill();
  const r = pg.width / num;
  let x, y;
  // numを2倍にするのがポイント
  for (let j = 0; j < num * 2 + 2; j++) {
    for (let i = 0; i < num + 1; i++) {
      if (j % 2 == 0) {
        pg.fill(110);
        x = r * i;
      } else {
        pg.fill(255);
        x = r * i + r / 2;
      }
      y = (r / 2) * j;
      pg.circle(x, y, r);
      pg.beginShape();
      for (let k = 0; k < 6; k++) {
        const xx = x + (r / 3) * Math.cos(p.radians(60 * k));
        const yy = y + (r / 3) * Math.sin(p.radians(60 * k));
        pg.vertex(xx, yy);
        // pg.circle(xx, yy, 50);
      }
      pg.endShape(p.CLOSE);
    }
  }
};
