import gsap from 'gsap';
import fs from './shader/normal.frag';
import vs from './shader/normal.vert';

/**
 * shader&base テンプレ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let theShader1;

  p.setup = () => {
    const init = () => {
      const canvasid = document.getElementById('mycanvas');
      canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
      canvas.parent(canvasid);
      p.imageMode(p.CENTER);
      p.textureMode(p.NORMAL);
      p.frameRate(24);
      p.noStroke();
    };
    init();

    pg = p.createGraphics(p.width, p.height);
    image_init(pg, p);

    theShader1 = p.createShader(vs, fs);
  };

  p.draw = () => {
    p.background(110);

    p.push();
    p.translate(-p.width / 2, -p.height / 2);
    const rect_s = 100;
    pg.push();
    //pg.translate(pg.width / 2, pg.height / 2);
    //grid(p, pg, 6, p.radians(0), '#D04848', '#6895D2');
    // cylinder2D(p, pg, rect_s, rect_s, 0, 0);
    grid2(p, pg, 6);
    pg.pop();

    const shaderImage = () => {
      p.shader(theShader1);
      theShader1.setUniform(`u_tex`, pg);
      theShader1.setUniform('u_resolution', [pg.width, pg.height]);
      theShader1.setUniform(`u_time`, -p.frameCount / 35);
    };
    shaderImage();
    p.pop();

    p.image(pg, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      // p.saveGif('p5js_rect-wave2', 4);
    }
  };
};

/** pgの初期化関数
 * @function image_init
 * @param {p5.Graphics} pg - p5.Graphics
 * @param {p5.canvas} p - p5インスタンス
 */
const image_init = (pg, p) => {
  //pg.rectMode(p.CENTER);
  pg.background(220);
  pg.fill(255);
  pg.noStroke();
};

/**
 * 二次元で円柱を作る
 * @function cylinder2D
 * @param {p5.canvas} p - p5インスタンス
 * @param {p5.Graphics} pg - p5.Graphics
 * @param {number} h - 円柱の高さ
 * @param {number} r - 円柱の半径
 * @param {number} tx - 円柱の中心x
 * @param {number} ty - 円柱の中心ý
 * @param {Array} colors - colorCodeのaraay(4つ)
 */
const cylinder2D = (p, pg, h, r, tx, ty, colors) => {
  // 円柱の下面をvertexで描画
  pg.push();
  pg.fill(colors[0]);
  pg.translate(tx, ty);
  pg.beginShape();
  let xx = (r / 2) * 1.5 * p.cos(p.radians(0));
  pg.vertex(xx, 0 - h);
  for (let i = 0; i < 180; i += 2) {
    const x = (r / 2) * 1.5 * p.cos(p.radians(i));
    const y = (r / 2) * p.sin(p.radians(i));
    pg.vertex(x, y);
  }
  xx = (r / 2) * 1.5 * p.cos(p.radians(180));
  pg.vertex(xx, 0 - h);
  pg.endShape(p.CLOSE);
  pg.pop();

  /** 円柱の側面の影を書く
   * @param {number} sw - start width
   * @param {number} ew - end width
   */
  const shadow = (sw, ew) => {
    pg.push();
    pg.translate(tx, ty);
    pg.beginShape();
    xx = (r / 2) * 1.5 * p.cos(p.radians(sw));
    pg.vertex(xx, 0 - h);
    for (let i = sw; i < ew + 1; i += 2) {
      const x = (r / 2) * 1.5 * p.cos(p.radians(i));
      const y = (r / 2) * p.sin(p.radians(i));
      pg.vertex(x, y);
      pg.vertex(x, y);
    }
    xx = (r / 2) * 1.5 * p.cos(p.radians(ew));
    pg.vertex(xx, 0 - h);
    pg.endShape(p.CLOSE);
    pg.pop();
  };
  pg.fill(colors[1]);
  shadow(0, 60);

  pg.fill(colors[2]);
  shadow(60, 120);

  // 円柱の上面
  pg.fill(colors[3]);
  pg.ellipse(tx, ty - h, r * 1.5, r);
};

/** num個で分割したグリッドをグラフィックスいっぱいに生成する
 * グリッド内に三つの丸角四角をを生成する
 * しっぱい
 * @function grid
 * @param {Number}             num      グラフィックスの分割数
 * @param {p5.Graphics object} pg       分割するグラフィックス画面
 * @param {Number}             r        回転する角度
 * @param {string} c1 - 色1
 * @param {string} c2 - 色2
 */
const grid = (p, pg, num, r, c1, c2) => {
  pg.push();
  const n1 = num + 1;
  const margin_left = pg.width / n1 / n1;
  const margin_bottom = pg.height / n1 / n1;
  const nw = pg.width / n1;
  const nh = pg.height / n1;
  pg.noStroke();
  // pg.translate(pg.width / 2, pg.height / 2);
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < 1; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      pg.push();
      pg.circle(x + nw / 2, y + nw / 2, nw);

      // pg.rotate(r);
      if (i % 2 === 0 || j % 2 === 1) {
        pg.fill(c1);
        pg.circle(x + nw / 2, y + nw / 2, nw);

        //pg.rect(x - pg.width / 2, y - pg.height / 2, nw, nh, 20);
        //cylinder2D(p, pg, nw, nw / 2, x, y);
      } else {
        pg.fill(c2);
        pg.circle(x + nw / 2, y + nw / 2, nw);
        //pg.rect(x - pg.width / 2, y - pg.height / 2, nw, nh, 20);
        //cylinder2D(p, pg, nw, 40, x, y);
      }
    }
    pg.pop();
  }
  pg.pop();
};

const grid2 = (p, pg, num) => {
  const n1 = num + 1;

  const margin_left = pg.width / n1 / n1;
  const margin_bottom = pg.height / n1 / n1;

  const nw = pg.width / n1;
  const nh = pg.height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      //pg.circle(x + nw / 2, y + nw / 2, nw);
      // pg.rotate(radians(p.random(360)));

      // 円柱をグリッド状に並べる
      const colors = ['#D04848', '#F3B95F', '#FDE767', '#6895D2'];
      cylinder2D(p, pg, nw / 2, nw / 2, x + nw / 2, y + (nw * 1.5) / 2, colors);
    }
  }
};
