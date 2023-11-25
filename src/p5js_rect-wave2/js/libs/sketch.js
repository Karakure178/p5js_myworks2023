/**
 * sin rect アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  const easing = {
    easeInQuad: (t) => t * t,
  };

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill('#CE7777');
    pg = p.createGraphics(p.width, p.height);
  };

  p.draw = () => {
    p.background('#2B3A55');
    p.push();
    p.translate(p.width / 2, p.height / 2);
    const frame = {
      count1: easing.easeInQuad(p.map(p.sin(p.radians(p.frameCount * 2)), 0, 1, 0, 20)),
      count2: easing.easeInQuad(p.map(p.sin(p.radians(p.frameCount * 2 + 10)), 0, 1, 0, 20)),
      count3: easing.easeInQuad(p.map(p.sin(p.radians(p.frameCount * 2 + 20)), 0, 1, 0, 20)),
      count4: easing.easeInQuad(p.map(p.sin(p.radians(p.frameCount * 2 + 30)), 0, 1, 0, 20)),
      count5: easing.easeInQuad(p.map(p.sin(p.radians(p.frameCount * 2 + 40)), 0, 1, 0, 20)),
    };
    drawRectWave(160, 9, frame.count1);
    drawRectWave(120, 7, frame.count2);
    drawRectWave(80, 5, frame.count3);
    drawRectWave(40, 3, frame.count4);
    p.rect(0, 0, 3 * frame.count5, 3 * frame.count5);
    p.pop();

    pg.background(220);
    pg.erase();
    pg.push();
    pg.circle(pg.width / 2, pg.height / 2, 400);
    pg.pop();
    pg.noErase();
    p.image(pg, 0, 0);

    p.push();
    p.noFill();
    p.circle(p.width / 2, p.height / 2, 400);
    p.pop();
    p.drawingContext.filter = 'drop-shadow(5px 10px 10px #3d3d3d)';
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_rect-wave2', 4);
    }
  };

  /**
   * 四角形を描くときに線と線の間を補完して四角形を配置・描画する関数
   * @function drawRectWave
   * @param {number} r - 四角形の元になる円の半径
   * @param {number} num - 線と線の間に含まれるrectの数
   * @param {number} size - rectのサイズ
   */
  const drawRectWave = (r, num, size) => {
    const angle = 360 / 4;
    const xy = { x: [], y: [] };
    for (let i = 0; i < 4; i++) {
      const x = r * p.cos(p.radians(i * angle));
      const y = r * p.sin(p.radians(i * angle));
      xy.x.push(x);
      xy.y.push(y);
      if (i - 1 >= 0) {
        for (let k = 0; k < num; k++) {
          const xx = p.map(k, 0, num - 1, xy.x[i - 1], xy.x[i]);
          const yy = p.map(k, 0, num - 1, xy.y[i - 1], xy.y[i]);
          p.rect(xx, yy, size, size);
        }
      }
      if (i + 1 === 4) {
        for (let k = 0; k < num; k++) {
          const xx = p.map(k, 0, num - 1, xy.x[i], xy.x[0]);
          const yy = p.map(k, 0, num - 1, xy.y[i], xy.y[0]);
          p.rect(xx, yy, size, size);
        }
      }
    }
  };
};
