import gsap from 'gsap';

/**
 * sin rect アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  const frame = { count: 0 };
  const sizeFrame = { count: 0.3 };

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
    motion(frame);
    sizeMotion(sizeFrame);
  };

  p.draw = () => {
    p.background('#2B3A55');
    p.push();
    p.translate(p.width / 2, p.height / 2);
    drawRectLeap(50, frame.count, p.map(sizeFrame.count, 0, 1, 10, 20), 4);
    p.rotate(p.radians(45));
    drawRectLeap(120, frame.count, p.map(sizeFrame.count, 0, 1, 20, 30), 4);
    p.rotate(p.radians(45));
    drawRectLeap(190, frame.count, p.map(sizeFrame.count, 0, 1, 40, 60), 4);
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
   * 図形を描くときに線と線の間を補完して四角形を配置・描画する関数
   * @function drawRectLeap
   * @param {number} r - 図形の元になる円の半径
   * @param {number} num - 四角形を描く線と線の間の描画位置
   * @param {number} size - rectのサイズ
   * @param {number} vertex - 図形の頂点数
   */
  const drawRectLeap = (r, num, size, vertex) => {
    const angle = 360 / vertex;
    const xy = { x: [], y: [] };
    for (let i = 0; i < vertex; i++) {
      const x = r * p.cos(p.radians(i * angle));
      const y = r * p.sin(p.radians(i * angle));
      xy.x.push(x);
      xy.y.push(y);
      if (i - 1 >= 0) {
        const xx = p.map(num, 0, 1, xy.x[i - 1], xy.x[i]);
        const yy = p.map(num, 0, 1, xy.y[i - 1], xy.y[i]);
        p.rect(xx, yy, size, size);
      }
      if (i + 1 === vertex) {
        const xx = p.map(num, 0, 1, xy.x[i], xy.x[0]);
        const yy = p.map(num, 0, 1, xy.y[i], xy.y[0]);
        p.rect(xx, yy, size, size);
      }
    }
  };

  /**
   * フレームの動きをアニメーション化関数
   * @param {Array} frame - フレーム情報の配列
   */
  const motion = (frame) => {
    gsap.timeline({ repeat: -1 }).to(frame, {
      count: 1,
      duration: 2,
      ease: 'quad.inOut',
    });
  };

  /**
   * sizeの動きをアニメーション化関数
   * @param {Array} frame - フレーム情報の配列
   */
  const sizeMotion = (frame) => {
    gsap
      .timeline({ repeat: -1 })
      .to(frame, {
        count: 0,
        duration: 2,
        ease: 'quad.inOut',
      })
      .to(frame, {
        count: 0.3,
        duration: 2,
        ease: 'quad.inOut',
      });
  };
};
