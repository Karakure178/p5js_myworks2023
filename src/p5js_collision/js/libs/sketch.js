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
    const rect_s = 100;
    pg.push();
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rect(0, 0, rect_s, rect_s);
    pg.pop();

    p.image(pg, 0, 0);
    const num = 60;
    const circles = getRandomCircles(num, p.width, p.height, p);
    circles.forEach((c) => p.circle(c.x, c.y, c.z));
    p.pop();
    p.noLoop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      //p.saveGif('p5js_rect-wave2', 4);
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

const grid = (n, p) => {
  const list = [];
  p.push();
  p.stroke(0);
  p.noFill();
  p.translate(-p.width / 2, -p.height / 2);
  const num = p.width / n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      p.rect(i * num, j * num, num, num);
      const n1 = p.createVector(i * num, j * num);
      const n2 = p.createVector(i * num + num, j * num);
      const n3 = p.createVector(i * num + num, j * num + num);
      const n4 = p.createVector(i * num, j * num + num);
      list.push([n1, n2, n3, n4]);
    }
  }
  p.pop();
  return list;
};

const getRandomCircles = (_num, _w, _h, p) => {
  let circles = [];
  const list = grid(5, p);

  for (let i = 0; i < _num; i++) {
    let x = p.random(-1, 1) * _w;
    let y = p.random(-1, 1) * _h;
    let z = p.random(3, 15); // z軸の値を円の大きさとして使用

    list.forEach((l) => {
      // 一番近い頂点を探す
      // https://gray-code.com/javascript/get-max-value-and-minimum-value-in-array/
      const n1 = p.dist(x, y, l[0].x, l[0].y);
      const n2 = p.dist(x, y, l[1].x, l[1].y);
      const n3 = p.dist(x, y, l[2].x, l[2].y);
      const n4 = p.dist(x, y, l[3].x, l[3].y);
      const ls = [n1, n2, n3, n4];
      const index = ls.indexOf(Math.min(...ls));
      x = l[index].x;
      y = l[index].y;
      console.log(ls, index);
    });

    if (circles.every((c) => p.dist(x, y, c.x, c.y) > (z + c.z) * 0.5)) {
      circles.push(p.createVector(x, y, z));
    }
  }
  return circles;
};
