import gsap from 'gsap';

/**
 * タイル上に並ぶ図形スケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg, pg2, pg3, pg4;
  let w;
  let n; // タイルの数

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    p.textureMode(p.NORMAL);
    p.frameRate(24);
    p.noStroke();

    w = p.width;
    n = 20;
    pg = p.createGraphics(w / n, w / n);
    image_init(pg, p);

    pg2 = p.createGraphics(w / n, w / n);
    image_init(pg2, p);

    pg3 = p.createGraphics(w / n, w / n);
    image_init(pg3, p);

    pg4 = p.createGraphics(w / n, w / n);
    image_init(pg4, p);
  };

  p.draw = () => {
    const bg = 110;
    const weight = Math.round(p.random(4, 15)); // 線の太さ
    p.background(bg);
    p.translate(-p.width / 2, -p.height / 2);

    p.push();

    for (let i = 0; i < n; i++) {
      const x = p.map(i, 0, n, 0, p.width);
      for (let j = 0; j < n; j++) {
        const y = p.map(j, 0, n, 0, p.height);

        const rand = Math.round(p.random(0, 3));

        // pg単品で重ね掛けだと条件分けがうまくいかなかったため
        // 条件の個数分、pgを作成して重ね掛けしてる
        if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
          pg.push();
          // pg.fill(i * 40, j * 40, 90);
          clossCircle(pg, pg.width, weight);
          pg.pop();
          p.image(pg, x, y);
        } else if (rand === 1) {
          pg2.push();
          pg2.fill(255);

          drawCloss(pg2, pg2.width / weight);
          pg2.pop();
          p.image(pg2, x, y);
        } else if (rand === 2) {
          pg3.push();
          drawCircles(pg3, 4, false, weight);

          pg3.pop();
          p.image(pg3, x, y);
        } else {
          pg4.push();
          drawCircles(pg4, 4, true, weight);

          p.image(pg4, x, y);
        }
      }
    }
    p.pop();
    p.noLoop();
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
  pg.background(110);
  pg.fill(255);
  pg.noStroke();
};

/** 四角と円を等倍幅に描く関数
 * @function drawCircles
 * @param {p5.Graphics} p - p5.Graphics
 * @param {number} num - 円の数
 * @param {boolean} dir - 円の向き
 * @param {number} weight - 線の太さ
 */
const drawCircles = (p, num, dir, weight) => {
  let diameter = p.width;
  p.push();
  // 反比例的な数値挙動を示すが数式に落とし込めないので力業実装
  const inside_weight =
    weight === 4
      ? 1000
      : weight === 5
        ? 10
        : weight === 6
          ? 3
          : weight === 7
            ? 0
            : weight === 8
              ? -2
              : weight === 9
                ? -3.5
                : weight === 10
                  ? -5
                  : weight === 11
                    ? -6.25
                    : weight === 12
                      ? -7.5
                      : weight === 13
                        ? -8.65
                        : weight === 14
                          ? -9.75
                          : weight === 15
                            ? -10.9
                            : weight === 16
                              ? -12
                              : 0;

  for (let i = num; i > 2; i--) {
    // 内側の円弧と外側の円弧で距離が違うので、それを調整する
    const d =
      i === num
        ? (i * (diameter + diameter / weight)) / num
        : (i * (diameter + diameter / (weight + inside_weight))) / num;
    if (i % 2 === 0) {
      p.fill(255);
    } else {
      p.erase();
      //p.fill(bg);
    }
    if (dir === true) {
      circles_right(p, d);
    } else {
      circles_left(p, d);
    }
    if (i % 2 !== 0) p.noErase();
  }
  p.pop();
};

/** 円を2隅に描く関数(右下)
 * @function circles
 * @param {p5.Graphics} p - p5.Graphics
 * @param {number} w - 幅
 */
const circles_right = (p, w) => {
  p.push();
  p.translate(p.width / 2, p.height / 2);

  p.circle(p.width / 2, -p.height / 2, w);
  p.scale(1, -1);
  p.circle(-p.width / 2, -p.height / 2, w);
  p.pop();
};

/** 円を2隅に描く関数(左下)
 * @function circles
 * @param {p5.Graphics} p - p5.Graphics
 * @param {number} w - 幅
 */
const circles_left = (p, w) => {
  p.push();
  p.translate(p.width / 2, p.height / 2);

  p.circle(-p.width / 2, -p.height / 2, w);
  p.scale(1, -1);
  p.circle(p.width / 2, -p.height / 2, w);
  p.pop();
};

/** クロスを描く関数
 * @function drawCloss
 * @param {p5.Graphics} p - p5.Graphics
 * @param {number} w - 幅
 */
const drawCloss = (p, w) => {
  p.push();
  p.translate(p.width / 2, p.height / 2);
  p.rect(0, -p.height / 2, w, p.height * 2);
  p.rect(-p.width / 2, 0, p.width * 2, w);
  p.pop();
};

/** 円とクロスを描く関数
 * @function clossCircle
 * @param {p5.Graphics} p - p5.Graphics
 * @param {number} w - 幅
 * @param {number} weight - 線の太さ
 */
const clossCircle = (p, w, weight) => {
  p.push();
  drawCloss(p, w / weight);

  p.translate(p.width / 2, p.height / 2);
  const size = p.random(1.5, 4.5);
  p.circle(0, 0, w / size);
  p.pop();
};

/** 中央に四角を描く関数
 * @function drawRect
 * @param {p5.Graphics} p
 * @param {number} w
 */
const drawRect = (p, w) => {
  const t = 1; // p.random(1, 2);
  p.rect(p.width / 2, p.height / 2, w * t, w * t);
};
