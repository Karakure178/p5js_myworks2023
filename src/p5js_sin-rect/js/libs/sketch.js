import gsap from 'gsap';
import p5 from 'p5';
/**
 * sin rect アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  const frame = { count: 0 };
  const num = 50;
  let sinCurveNum;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.rectMode(p.CENTER);
    motion(frame, true);
    p.noStroke();
    p.fill('#fff');
    sinCurveNum = p.height / 10;
  };

  p.draw = () => {
    p.background('#161d1d');
    p.push();
    for (let i = 0; i < sinCurveNum; i++) {
      sinCurveGroup(i * 100);
    }
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_grid-tile', 'png');
      p.saveGif('p5js_grid-tile', 8);
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
  const sinCurve = (num, n, x, y, r, size) => {
    const angle = 360 / num;
    const rad = p.radians(n * angle);
    p.push();
    p.translate(x, y);
    const y1 = r * p.sin(rad);
    p.rect(0, y1, size, size);
    p.pop();
  };

  /**
   * 指定されたy座標に正弦曲線のグループを描画する関数
   * @param {number} y - 正弦曲線のグループを描画するy座標
   */
  const sinCurveGroup = (y) => {
    const margin = p.width / num;
    for (let i = 0; i < num; i++) {
      const n = p.map(frame.count, 0, 1, 0, 10) + i;
      sinCurve(6, n, i * margin, y, 14, 6);
    }
  };

  /**
   * フレームの動きをアニメーション化します。
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
