import gsap from 'gsap';

/**
 * アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  const frame = { count: 0 };

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.noStroke();
    p.fill('#CE7777');

    pg = p.createGraphics(p.width, p.height);
    image_init(pg);

    motion(frame);
  };

  p.draw = () => {
    p.background('#F3EEEA');
    p.translate(-p.width / 2, -p.height / 2);

    // 薄い、中間、濃いの順でカラーが異なる
    const colors = [
      ['#9EC8B9', '#5C8374', '#092635'],
      ['#F0ECE5', '#B6BBC4', '#161A30'],
      ['#ECF4D6', '#9AD0C2', '#2D9596'],
      ['#F05941', '#BE3144', '#872341'],
      ['#FFC7C7', '#ED9ED6', '#C683D7'],
      ['#F5F5F5', '#F99417', '#4D4C7D'],
      ['#F7E987', '#5B9A8B', '#445069'],
      ['#8CABFF', '#4477CE', '#512B81'],
    ];

    pg.push();
    for (let i = 0; i < colors.length; i++) {
      const x = p.random(0, p.width);
      const y = p.random(0, p.height);
      bear(x, y, 100, pg, colors[i]);
    }
    pg.pop();
    if (p.frameCount === 100) p.noLoop();
    p.image(pg, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_fisheye', 'png');
      p.saveGif('p5js_fisheye', 4);
    }
  };

  // createGraphicsの初期設定
  const image_init = (pg) => {
    //pg.rectMode(p.CENTER);
    //pg.background(220);// 透明にしたい場合はコメントアウト
    pg.noStroke();
    pg.fill('#776B5D');
  };

  /**
   * くまさんを作る
   * @param {number} x - くまを呼び出す中心座標x
   * @param {number} y - くまを呼び出す中心座標y
   * @param {number} r - くまの直径
   * @param {p5.Graphics} pg - 描画用レイヤー
   * @param {Array} colors - カラーの配列
   */
  const bear = (x, y, r, pg, colors) => {
    const ear_width = r / 2.8;
    const ear_height = y - r / 3;
    const eye_angle = 10;
    const nose_height = y + r / 10;
    const mouth_height = nose_height + r / 20;

    // 耳
    const ear = () => {
      // 両耳(外枠)
      pg.push();
      pg.fill(colors[0]);
      const left_ear = x - ear_width;
      const right_ear = x + ear_width;
      pg.circle(left_ear, ear_height, r / 3);
      pg.circle(right_ear, ear_height, r / 3);
      pg.pop();

      // 両耳(内枠)
      pg.push();
      pg.fill(colors[1]);
      const left_ear_small = x - ear_width;
      const right_ear_small = x + ear_width;
      pg.circle(left_ear_small, ear_height, r / 4);
      pg.circle(right_ear_small, ear_height, r / 4);
      pg.pop();
    };
    ear();

    // 土台
    pg.fill(colors[0]);
    pg.ellipse(x, y, r, r / 1.2);

    // 鼻
    const nose = () => {
      pg.push();
      pg.fill(colors[2]);
      pg.circle(x, nose_height, r / 20);
      pg.pop();
    };
    nose();

    // 左目
    const left_eye = (angle) => {
      pg.push();
      // 黒目
      pg.fill(100);
      pg.stroke(50);
      pg.strokeWeight(0.8);
      pg.translate(x + r / 4.2, y - r / 10);
      pg.rotate(p.radians(angle));
      pg.arc(0, 0, r / 4, r / 4, p.radians(0), p.radians(180), p.CHORD);

      // 白目
      pg.fill(255);
      pg.arc(0, 0, r / 5, r / 5, p.radians(0), p.radians(180), p.CHORD);

      // 黒目
      pg.fill(10);
      pg.arc(0, 0, r / 10, r / 10, p.radians(0), p.radians(180), p.CHORD);
      pg.pop();
    };
    left_eye(eye_angle);

    // 右目
    const right_eye = (angle) => {
      pg.push();
      // 黒目
      pg.fill(100);
      pg.stroke(50);
      pg.strokeWeight(0.8);
      pg.translate(x - r / 4.2, y - r / 10);
      pg.rotate(p.radians(-angle));
      pg.arc(0, 0, r / 4, r / 4, p.radians(0), p.radians(180), p.CHORD);

      // 白目
      pg.fill(255);
      pg.arc(0, 0, r / 5, r / 5, p.radians(0), p.radians(180), p.CHORD);

      // 黒目
      pg.fill(10);
      pg.arc(0, 0, r / 10, r / 10, p.radians(0), p.radians(180), p.CHORD);
      pg.pop();
    };
    right_eye(eye_angle);

    // 口(枠なし)
    const mouth = () => {
      pg.push();
      pg.stroke(colors[2]);
      pg.strokeWeight(2);
      pg.line(x, mouth_height, x - r / 20, nose_height + r / 10);
      pg.line(x, mouth_height, x + r / 20, nose_height + r / 10);
      pg.pop();
    };
    mouth();
  };
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
      ease: 'expo.inOut',
    })
    .to(frame, {
      count: 0,
      duration: 2,
      ease: 'expo.inOut',
    });
};
