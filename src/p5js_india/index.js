import p5 from 'p5';

const sketch = function (p) {
  let canvas;
  let pg;
  let backgroundPG;

  /* 円と円のあたり判定の処理を確認するテスト関数
   * @method base
   * @param  {Number}        count       フレームカウント用
   */
  function base() {
    const r = 40;
    const x = 0;
    const y = 0;

    const xx = r;
    const yy = 140;

    const xxx = yy;
    const yyy = r;
    //backgroundPG.push();

    for (let i = 0; i < 10; i++) {
      p.push();
      p.translate(x + i * r, y + i * r);
      if (i % 2 === 0) {
        p.fill('#FFF5E0');
      } else {
        p.fill('#C70039');
      }
      p.rect(x, y, xx, yy);
      if (i % 2 === 0) {
        p.fill('#FF6969');
      } else {
        p.fill('#141E46');
      }

      p.rect(xx, y, xxx, yyy);
      p.pop();
    }
    //backgroundPG.pop();
  }

  p.preload = function () {
    pg = p.createGraphics(600, 400);
    backgroundPG = p.createGraphics(600, 400);
    backgroundPG.background(220);
  };

  p.setup = function () {
    canvas = p.createCanvas(600, 400);
    p.background(220);
    p.noStroke();

    // 真ん中
    base();

    // 右隣
    p.push();
    p.translate(180, -100);
    base();
    p.pop();

    // 左下
    p.push();
    p.translate(-180, 100);
    base();
    p.pop();

    // 右上
    p.push();
    p.translate(440, -120);
    base();
    p.pop();

    // pg.background(220);
    // pg.erase();
    // pg.push();
    // pg.circle(pg.width / 2, pg.height / 2, 220);
    // pg.pop();
    // pg.noErase();
    // p.drawingContext.filter = 'drop-shadow(10px 20px 16px rgba(46,46,46,0.9))';

    backgroundPG.loadPixels();
  };

  p.draw = function () {
    //p.background(0, 10);
    p.image(pg, 0, 0);

    //
  };

  p.keyPressed = function () {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'myCanvas', 'png');
      // p.saveGif('p5js_rotate', 4);
    }
  };
};

new p5(sketch);
