import gsap from 'gsap';
import fs from './shader/hacting.frag';
import vs from './shader/normal.vert';

/**
 * 円柱が拡大縮小するだけ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let theShader1;

  // 円柱の長さ変える用、easingで二つに分けてる
  let frame1;
  let frame2;

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

    // motion用初期化
    frame1 = motion('quad.inOut');
    frame2 = motion('quad.in');
  };

  p.draw = () => {
    p.background(110);

    p.push();
    p.translate(-p.width / 2, -p.height / 2);
    pg.push();
    pg.background(220);
    grid2(p, pg, 6, frame1, frame2);
    pg.pop();

    const shaderImage = () => {
      p.shader(theShader1);
      theShader1.setUniform(`u_tex`, pg);
      theShader1.setUniform('u_resolution', [pg.width, pg.height]);
      theShader1.setUniform(`u_time`, -p.frameCount / 35);
      theShader1.setUniform(`u_color`, rand_color(p, '#f3f3f3'));
    };
    shaderImage();

    p.translate(p.width / 2, p.height / 2);
    p.image(pg, 0, 0);
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_entyu', 4);
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

/** カラーコードを0-1の配列に変換する
 * @function rand_color
 * @param  {string}        colorCode          カラーコード
 */
const rand_color = (p, colorCode) => {
  let rc = p.color(colorCode);
  return [p.red(rc) / 255.0, p.green(rc) / 255.0, p.blue(rc) / 255.0];
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

const grid2 = (p, pg, num, frame, frame2) => {
  const n1 = num + 1;

  const margin_left = pg.width / n1 / n1;
  const margin_bottom = pg.height / n1 / n1;

  const nw = pg.width / n1;
  const nh = pg.height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);

      // 円柱をグリッド状に並べる
      if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
        const colors = ['#D04848', '#F3B95F', '#FDE767', '#6895D2'];
        const size = p.map(frame.count, 0, 1, nw / 3, nw / 2);
        cylinder2D(p, pg, nw / 2, size, x + nw / 2, y + (nw * 1.5) / 2, colors);
      } else {
        const colors = ['#191919', '#750E21', '#E3651D', '#BED754'];
        const size = p.map(frame2.count, 0, 1, nw / 2, nw / 3);
        cylinder2D(p, pg, nw / 3, size, x + nw / 2, y + (nw * 1.5) / 2, colors);
      }
    }
  }
};

/** gsapで円柱の長さ変える
 * @function motion
 */
const motion = (easing) => {
  const easing_str = easing;
  const duration = 1;
  const frame = { count: 0 };

  const tl = gsap.timeline({ repeat: -1, yoyo: false });
  tl.to(frame, {
    count: 1,
    duration: duration,
    ease: easing_str,
  }).to(frame, {
    count: 0,
    duration: duration,
    ease: easing_str,
  });
  return frame;
};
