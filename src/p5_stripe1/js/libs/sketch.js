/**
 * ストライプスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;

  p.setup = () => {
    const one = document.getElementById('one');
    canvas = p.createCanvas(one.clientWidth, one.clientHeight);
    canvas.parent(one);

    p.noStroke();
    stripes(['#2B2A4C', '#2D9596'], 30, 20);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'myCanvas', 'png');
      //p.saveGif('p5js_width-pattern2', 3);
    }
  };

  /**
   * グラフィックオブジェクトにストライプを描画します。
   * @param {Array} color - [color1, color2] のような2つの色の配列です。
   * @param {number} num - 描画するストライプの数です。
   * @param {number} size - 各ストライプの高さです。
   */
  const stripes = (color, num, size) => {
    p.push();
    p.noStroke();
    for (let i = 0; i < num; i++) {
      if (i % 2 === 0) {
        p.fill(color[0]);
        p.translate(0, size);
        p.rect(0, 0, p.width, size);
      } else {
        p.fill(color[1]);
        p.translate(0, size + size / 2);
        p.rect(0, 0, p.width, size / 3);
      }
    }
    p.pop();
  };
};
