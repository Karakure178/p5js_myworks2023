/**
 * gridちょっとずらすスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.rectMode(p.CENTER);
    p.noStroke();
    pg = p.createGraphics(p.width, p.height);
  };

  p.draw = () => {
    p.background('#EEE2DE');
    p.push();
    grid(12);
    p.pop();

    p.push();
    p.noFill();
    p.stroke('#091221');
    p.strokeWeight(10);
    p.drawingContext.filter = 'drop-shadow(10px 10px 5px #350000)';
    p.circle(p.width / 2, p.height / 2, 395);
    p.pop();

    pg.background('#091221');
    pg.erase();
    pg.push();
    pg.circle(pg.width / 2, pg.height / 2, 400);
    pg.pop();
    pg.noErase();
    p.image(pg, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      //p.saveGif('p5js_rect-wave2', 4);
    }
  };

  /** num個で分割したグリッドを画面いっぱいに生成する
   * @method grid
   * @param  {Number}        num           画面の分割数
   */
  function grid(num) {
    const n1 = num + 1;
    const width = p.width * 2;
    const height = p.height * 2;

    const margin_left = width / n1 / n1;
    const margin_bottom = height / n1 / n1;
    const nw = width / n1;
    const nh = height / n1;
    p.push();
    p.translate(-nw / 2, 0);
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        if (j % 2 === 0) {
          p.fill('#B31312');
          const r = nw;
          const round = 10;
          p.rect(x + nw / 2, y + nh / 2, r, r, round, round, round, round);
        } else {
          p.fill('#EA906C');
          const r = nw;
          const round = 20;
          p.rect(x + nw, y + nh / 2, r, r, round, round, round, round);
        }
      }
    }
    p.pop();
  }
};
