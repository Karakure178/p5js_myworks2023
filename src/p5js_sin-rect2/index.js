import p5 from 'p5';

const sketch = function (p) {
  let num = 5;
  let switching = false;
  let canvas;

  /* draw_CollisionDetection
   * 四角のあたり判定でパーリンノイズの描画有無を決める(rectMode基準)
   * @method grid
   * @param  {p5.Vector}     points      あたり判定用の座標配列
   * @param  {Number}        nw          あたり判定で使う四角の範囲（幅）
   * @param  {Number}        nh          あたり判定で使う四角の範囲（高さ）
   */
  function draw_CollisionDetection(points, nw, nh) {
    p.noFill();
    p.strokeWeight(3);
    for (let i = 0; i < p.width; i += 1) {
      //const h = p.random(50, 90);
      const parin = p.noise(0.01 * i) * p.height;
      const xx = i;
      for (let j = 0; j < p.height; j += 10) {
        const yy = j + parin;
        p.beginShape();
        for (let k = 0; k < points.length; k++) {
          if (points[k].x < xx && points[k].y < yy && xx < points[k].x + nw && yy < points[k].y + nh) {
            p.vertex(xx, yy);
          }
        }
        p.endShape(p.CLOSE);
      }
    }
  }

  /* num個で分割したグリッドを画面いっぱいに生成する
   * @method grid
   * @param  {Number}        num           画面の分割数
   */
  function grid(num) {
    const n1 = num + 1;

    const margin_left = p.width / n1 / n1;
    const margin_bottom = p.height / n1 / n1;
    const nw = p.width / n1;
    const nh = p.height / n1;

    const points = [];
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        p.rect(x, y, nw, nh);
        points.push(new p5.Vector(x, y));
      }
    }
    draw_CollisionDetection(points, nw, nh);
  }

  p.setup = function () {
    canvas = p.createCanvas(600, 600);
    p.background(22);
    p.frameRate(24);
    //p.noFill();
    grid(num);
  };

  let count = 0;
  p.draw = function () {
    //p.translate(p.width / 2, p.height / 2);
    //p.background(220);

    if (count < 100 && !switching) {
      count += 1;
    } else if (count - 1 < 0) {
      switching = false;
      count += 1;
    } else {
      switching = true;
      count -= 1;
    }
  };

  p.keyPressed = function () {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'myCanvas', 'png');
      //p.saveGif('p5js_rotate', 4);
    }
  };
};

new p5(sketch);
