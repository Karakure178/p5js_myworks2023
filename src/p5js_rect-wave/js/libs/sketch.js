import gsap from 'gsap';
/**
 * sin rect アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  const frame1 = { count: 0 };
  const frame2 = { count: 0.2 };
  const frame3 = { count: 0.4 };
  const frame4 = { count: 0.6 };

  const num = 50;
  let pg;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill('#fff');
    pg = p.createGraphics(p.width, p.height);

    motion(frame1);
    motion(frame2);
    motion(frame3);
    motion(frame4);
  };

  p.draw = () => {
    p.background('#161d1d');
    p.push();
    p.translate(p.width / 2, p.height / 2);
    drawRectWave(160, 9, 20 * frame1.count);
    drawRectWave(120, 7, 15 * frame2.count);
    drawRectWave(80, 5, 10 * frame3.count);
    drawRectWave(40, 3, 5 * frame4.count);
    p.rect(0, 0, 3, 3);
    p.pop();

    // pg.background(220);
    // pg.erase();
    // pg.push();
    // pg.circle(pg.width / 2, pg.height / 2, 400);
    // pg.pop();
    // pg.noErase();
    // p.image(pg, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_sin-rect2', 'png');
      p.saveGif('p5js_sin-rect2', 4);
    }
  };

  /**
   * 指定されたパラメータを使用して正弦曲線を描画する関数
   * @param {number} num - 特定の点にある曲線の分割数
   * @param {number} n - 分割された曲線の角度
   * @param {number} x - 曲線の描画開始位置のx座標
   * @param {number} y - 曲線の描画開始位置のy座標
   * @param {number} r - 曲線の半径
   * @param {number} size - 描画する正方形のサイズ
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

  /**
   * フレームの動きをアニメーション化
   * @param {Array} frame - フレーム情報の配列
   */
  const motion = (frame) => {
    gsap
      .timeline({ repeat: -1 })
      .to(frame, {
        count: 1,
        duration: 2,
        ease: 'Linear.easeNone',
      })
      .to(frame, {
        count: 0,
        duration: 2,
        ease: 'Linear.easeNone',
      });
  };
};
