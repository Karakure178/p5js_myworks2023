import gsap from 'gsap';

/**
 * shader&base テンプレ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let n = 150;
  const line_item = []; //{y:0,frame:{count:0},bool:false}予定
  const line_totalFrame = motion(); // 線全体のフレーム(アニメーション遷移用)

  p.setup = () => {
    const init = () => {
      const canvasid = document.getElementById('mycanvas');
      canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight);
      canvas.parent(canvasid);
      p.imageMode(p.CENTER);
      p.textureMode(p.NORMAL);
      p.frameRate(24);
      p.noFill();
      p.strokeWeight(3);
    };
    init();

    pg = p.createGraphics(p.width, p.height);
    image_init(pg, p);

    // 以降線の個数分frameを作成
    const h = p.height / n;
    for (let i = 0; i < n; i++) {
      const lineFrame = p.map(i, 0, n, 0, 1);
      line_item.push({ y: h * i, frame: { count: 0 }, lineFrame: lineFrame, bool: false });
    }
  };

  p.draw = () => {
    p.background(220);

    p.push();
    pg.push();
    pg.pop();

    //p.image(pg, 0, 0);
    p.pop();

    line_item.forEach((item) => {
      line_movie(item, p, line_totalFrame);
    });
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_rect-wave2', 4);
    }
  };
};

/** pgの初期化関数
 * @function image_init
 * @param {p5.Graphics} pg - p5.Graphics
 * @param {p5.canvas} p - p5インスタンス
 */
const image_init = (pg, p) => {
  pg.rectMode(p.CENTER);
  pg.background(110);
  pg.fill(255);
  pg.noStroke();
};

/** 点から線を走らせる
 * @function line_movie
 */
const line_movie = (item, p, line_totalFrame) => {
  //線を端から端まで走らせたい
  // gsapを使って走らせたい
  // map関数でmap(frame,0,1,0,p.width)したい
  // 特定の高さで特定の個数を順々に走らせたい
  if (!item.bool && item.lineFrame < line_totalFrame.count) {
    item.frame = motion();
    item.bool = true;
  } else {
    const x = p.map(item.frame.count, 0, 1, 0, p.width);
    p.line(0, item.y, x, item.y);
  }
};

/**
 * モーション関数 点から線を走らせる gsap使用
 * @function motion
 * @return {object} frame - モーションのフレーム(0-1)
 */
const motion = () => {
  const easing_str = 'quad.inOut';
  const duration = 1;
  const delay = 0;
  const frame = { count: 0 };

  const tl = gsap.timeline({ repeat: -1, yoyo: true });
  tl.to(frame, {
    count: 1,
    duration: duration,
    ease: easing_str,
    onUpdate: () => {
      // console.log(frame.count);
    },
  });
  return frame;
};
