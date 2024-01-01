/**
 * タイル上に並ぶ図形スケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let fb;
  let pgs = [];
  let w;
  let n; // タイルの数

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    p.textureMode(p.NORMAL);
    p.frameRate(24);
    //p.noStroke();
    p.noFill();

    fb = p.createFramebuffer({ width: p.width, height: p.height });
    w = p.width;
    n = 7;
    // pgの初期化
    for (let i = 0; i < 4; i++) {
      pgs[i] = p.createGraphics(w / n, w / n);
      image_init(pgs[i], p);
    }
  };

  p.draw = () => {
    const group = () => {
      const bg = 110;
      p.background(bg);
      p.translate(-p.width / 2, -p.height / 2);

      p.push();
      for (let i = 0; i < n; i++) {
        const x = p.map(i, 0, n, 0, p.width);
        for (let j = 0; j < n; j++) {
          const y = p.map(j, 0, n, 0, p.height);
          fb.begin();
          p.translate(-p.width / 2, -p.height / 2);

          // 確認用コード
          // p.push();
          // p.rect(x, y, p.width / n, p.height / n);
          // p.pop();

          drawTiles(p, pgs, x, y, i, j);
          fb.end();
        }
      }

      p.image(fb, 0, 0);
      p.noLoop();
    };
    group();
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
  //pg.background(110);
  pg.fill(255);
  pg.noStroke();
};

/** タイルを複数個描く関数
 * @function drawTiles
 * @param {p5.Graphics} p - p5.Graphics
 */
const drawTiles = (p, pg, x, y, i, j) => {
  const rand = Math.round(p.random(0, 3));
  // pg単品で重ね掛けだと条件分けがうまくいかなかったため
  // 条件の個数分、pgを作成して重ね掛けしてる

  if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
    pg[0].push();
    tile2(pg[0], pg[0].width / 4);
    pg[0].pop();
    p.image(pg[0], x, y);
  } else if (rand === 1) {
    pg[1].push();
    tile6(pg[1], pg[1].width / 4);
    pg[1].pop();
    p.image(pg[1], x, y);
  } else if (rand === 2) {
    pg[2].push();
    tile7(pg[2], pg[2].width / 4);
    pg[2].pop();
    p.image(pg[2], x, y);
  } else {
    pg[3].push();
    // pg[3].fill('#f23456');
    tile5(pg[3], pg[3].width / 4);
    pg[3].pop();
    p.image(pg[3], x, y);
  }
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

/** タイル用の一つの模様を描く
 * 今回は、四角メイン・真ん中に小さい四角形がある模様
 * @function tile2
 * @param {pg.Graphics} pg
 * @param {number} w - 四角の幅と高さ（共通量）
 */
const tile2 = (pg, w = pg.width / 4) => {
  pg.push();
  pg.fill(255);
  pg.translate(pg.width / 2, pg.height / 2);

  // 回りの模様
  const angle = 90;
  for (let i = 0; i < 360 / angle; i++) {
    pg.push();
    pg.rotate(pg.radians(angle * i));
    pg.rect(w * 2, 0, w, w);
    pg.pop();
  }

  // 中央の模様(十字)
  pg.rect(0, 0, w, w * 2);
  pg.rect(0, 0, w * 2, w);

  pg.pop();
};

/** タイル用の一つの模様を描く
 * 角を曲げる
 * 特徴が三角形で描画しているので線がかけない
 * @function tile5
 * @param {pg.Graphics} pg
 * @param {number} w - 四角の幅と高さ（共通量）
 */
const tile5 = (pg, w = pg.width / 4) => {
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);
  //if (pg.random(1) > 0.5) pg.scale(1, -1);

  // 回りの模様
  const angle = 90;
  const right = () => {
    pg.push();
    pg.rect(pg.width / 2, 0, w, w);
    pg.rotate(pg.radians(angle * 1));
    pg.rect(pg.width / 2, 0, w, w);
    pg.pop();

    pg.push();
    pg.beginShape();
    pg.vertex(w * 2 - w / 2, -w / 2, 0, 0);
    pg.vertex(w * 2 - w / 2, w / 2, 0, 0);
    pg.vertex(w / 2, w * 2 - w / 2, 0, 0);
    pg.vertex(-w / 2, w * 2 - w / 2, 0, 0);
    pg.endShape(pg.CLOSE);
    pg.pop();
  };

  const left = () => {
    pg.push();
    pg.scale(-1, -1);
    pg.rect(pg.width / 2, 0, w, w);
    pg.rotate(pg.radians(angle * 1));
    pg.rect(pg.width / 2, 0, w, w);
    pg.pop();

    pg.push();
    pg.scale(-1, -1);
    pg.beginShape();
    pg.vertex(w * 2 - w / 2, -w / 2, 0, 0);
    pg.vertex(w * 2 - w / 2, w / 2, 0, 0);
    pg.vertex(w / 2, w * 2 - w / 2, 0, 0);
    pg.vertex(-w / 2, w * 2 - w / 2, 0, 0);
    pg.endShape(pg.CLOSE);
    pg.pop();
  };

  right();
  left();
  pg.pop();
};

/** タイル用の一つの模様を描く
 * 角を曲げる
 * 角と図形重ねているので線がかけない
 * @function tile6
 * @param {pg.Graphics} pg
 * @param {number} w - 四角の幅と高さ（共通量）
 */
const tile6 = (pg, w = pg.width / 4) => {
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);

  // 回りの模様
  const angle = 90;

  const right = () => {
    pg.push();
    pg.rect(pg.width / 2, 0, w * 2, w);
    pg.rotate(pg.radians(angle * 1));
    pg.rect(pg.width / 2, 0, w * 2, w);
    pg.pop();

    pg.push();
    pg.rect(w, w, w, w);
    pg.pop();
  };

  const left = () => {
    pg.push();
    pg.scale(-1, -1);
    pg.rect(pg.width / 2, 0, w * 2, w);
    pg.rotate(pg.radians(angle * 1));
    pg.rect(pg.width / 2, 0, w * 2, w);
    pg.pop();

    pg.push();
    pg.scale(-1, -1);
    pg.rect(w, w, w, w);
    pg.pop();
  };

  right();
  left();
  pg.pop();
};

/** タイル用の一つの模様を描く
 * 角を曲げる
 * 角と図形重ねているので線がかけない
 * @function tile7
 * @param {pg.Graphics} pg
 * @param {number} w - 四角の幅と高さ（共通量）
 */
const tile7 = (pg, w = pg.width / 4) => {
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);

  // 回りの模様
  const angle = 90;
  const right = () => {
    pg.push();
    pg.rect(w * 2, 0, w * 2, w);
    pg.rotate(pg.radians(angle * 1));
    pg.rect(w * 2, 0, w * 2, w);
    pg.pop();

    pg.push();
    pg.rect(w / 2, w / 2, w, w);
    pg.pop();
  };

  const left = () => {
    pg.push();
    pg.scale(-1, -1);
    pg.rect(w * 2, 0, w * 2, w);
    pg.rotate(pg.radians(angle * 1));
    pg.rect(w * 2, 0, w * 2, w);
    pg.pop();

    pg.push();
    pg.scale(-1, -1);
    pg.rect(w / 2, w / 2, w, w);
    pg.pop();
  };

  right();
  left();
  pg.pop();
};
