import gsap from 'gsap';
/**
 * 円で重なり模様をくり抜くスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let pg;
  let canvas;
  p.setup = () => {
    const one = document.getElementById('one');
    canvas = p.createCanvas(one.clientWidth, one.clientHeight);
    canvas.parent(one);
    pg = p.createGraphics(p.width, p.height);

    p.noStroke();
    const num = 30;
    curtain(num, p.width / num);

    pg.background(220);
    pg.erase();
    pg.push();
    pg.circle(pg.width / 2, pg.height / 2, 220);
    pg.pop();
    pg.noErase();
    p.image(pg, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'myCanvas', 'png');
      ///p.saveGif('p5js_line-circle', 6);
    }
  };

  /**
   * 四角形の重なり模様を描く関数
   * @param {number} num - 何個の四角形を描くか
   * @param {number} s - 四角形の幅
   */
  const curtain = (num, s) => {
    for (let i = num; i > 0; i--) {
      const x = s * i;
      const y = p.height;
      p.push();
      {
        p.drawingContext.filter = 'drop-shadow(2px 0px 30px #000)';
        p.fill(200);
        p.rect(0, 0, x, y);
      }
      p.pop();
    }
  };
};
