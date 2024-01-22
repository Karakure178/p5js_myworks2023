import gsap from 'gsap';

/**
 * shader&base テンプレ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;

  // 線のアニメーション用変数
  let n = 50;
  const line_item = []; //{y:0,frame:{count:0},bool:false}予定
  let line_totalFrame = motion(); // 線全体のフレーム(アニメーション遷移用)

  // circle1のアニメーション用変数
  let circle_totalFrame;
  let circle_bool = false;

  // circle packingのアニメーション用変数
  let circlePacking_totalFrame;
  let circlePacking_bool = false;
  const num = 3000; // 試行回数
  const circlePacking_item = [];
  const colors = ['#D04848', '#F3B95F', '#FDE767', '#6895D2', '#132043', '#1F4172', '#F1B4BB'];

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

    // 以降線の個数分frameを作成
    const h = p.height / n;
    for (let i = 0; i < n; i++) {
      const lineFrame = p.map(i, 0, n, 0, 1);
      line_item.push({
        y: h * i,
        frame: { count: 0 },
        lineFrame: lineFrame,
        bool: false,
      });
    }

    // circle packingのアニメーション用準備
    const circles = getRandomCircles(p, num, p.width * 0.4, p.height * 0.4);
    circles.forEach((c, i) => {
      const circleFrame = p.map(i, 0, circles.length, 0, 1);
      circlePacking_item.push({
        circle: { x: c.x, y: c.y, z: c.z },
        frame: { count: 0 },
        circleFrame: circleFrame,
        bool: false,
        color: p.random(colors),
      });
    });
  };

  //  colors[Math.round(p.random(0, colors.length))]
  p.draw = () => {
    p.background(220);

    // 線を描画
    line_item.forEach((item) => {
      line_move(item, p, line_totalFrame);
    });

    // 線のアニメーションが終わったら円のアニメーションに移動
    if (line_totalFrame.count >= 1.0) {
      p.push();
      p.fill(220);
      p.noStroke();
      if (!circle_bool) {
        circle_totalFrame = circleMotion(); // 円全体のフレーム(アニメーション遷移用)
        circle_bool = true;
      } else {
        circle_move(p, circle_totalFrame);
      }
      p.pop();

      // 円のアニメーションが終わったらcircle packingのアニメーションに移動
      if (circle_totalFrame.count >= 1.0) {
        if (!circlePacking_bool) {
          circlePacking_totalFrame = packingMotion(); // 円全体のフレーム(アニメーション遷移用)
          circlePacking_bool = true;
        } else {
          circlePacking_item.forEach((item) => {
            if (!item.bool && item.circleFrame > circlePacking_totalFrame.count) {
              item.frame = packingMotion();
              item.bool = true;
            } else {
              p.push();
              p.translate(p.width / 2, p.height / 2);
              p.fill(item.color);
              p.noStroke();
              //if (item.frame.count >= 0.98) p.noStroke();
              packing_move(p, item);
              p.pop();
            }
          });
        }
      }
    }
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_rect-wave2', 20);
    }
  };
};

/** 点から線を走らせる
 * @function line_move
 */
const line_move = (item, p, line_totalFrame) => {
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
 * 円を拡大する（最初に戻る）
 * @function circle_move
 */
const circle_move = (p, circle_totalFrame) => {
  const size = p.map(circle_totalFrame.count, 0, 1, 0, p.width * 1.5);
  p.circle(p.width / 2, p.height / 2, size);
};

/**
 * 円を拡大する(circle packing用)
 * @function packing_move
 */
const packing_move = (p, packing) => {
  const size = p.map(packing.frame.count, 0, 1, 0, packing.circle.z);
  p.circle(packing.circle.x, packing.circle.y, size);
};

/**
 * モーション関数 点から線を走らせる gsap使用
 * @function motion
 * @return {object} frame - モーションのフレーム(0-1)
 */
const motion = () => {
  const easing_str = 'quad.inOut';
  const duration = 1;
  const frame = { count: 0 };

  const tl = gsap.timeline({ repeat: 1, yoyo: false });
  tl.to(frame, {
    count: 1,
    duration: duration,
    ease: easing_str,
    onComplete: () => {
      // console.log(frame.count);
    },
  });
  return frame;
};

/**
 * モーション関数 円を縮小してから拡大する gsap使用
 * @function Motion
 * @return {object} frame - モーションのフレーム(0-1)
 */
const circleMotion = () => {
  const easing_str = 'quad.inOut';
  const frame = { count: 0 };

  const tl = gsap.timeline({ repeat: 0, yoyo: false });
  tl.to(frame, {
    count: 1,
    duration: 1,
    ease: easing_str,
  })
    .to(frame, {
      count: 0.6,
      duration: 0.5,
      ease: easing_str,
    })
    .to(frame, {
      count: 1,
      duration: 1,
      ease: easing_str,
    });
  return frame;
};

/**
 * モーションpacking関数 円を縮小してから拡大する gsap使用
 * @function packingMotion
 * @return {object} frame - モーションのフレーム(0-1)
 */
const packingMotion = () => {
  const easing_str = 'quad.inOut';
  const frame = { count: 0 };

  const tl = gsap.timeline({ repeat: 0, yoyo: false });
  tl.to(frame, {
    count: 1,
    duration: 1,
    ease: easing_str,
  })
    .to(frame, {
      count: 0.6,
      duration: 0.5,
      ease: easing_str,
    })
    .to(frame, {
      count: 1,
      duration: 0.5,
      ease: easing_str,
    })
    .to(frame, {
      count: 0,
      duration: 1,
      ease: easing_str,
    });
  return frame;
};

/**
 * circle packing用関数
 * @param {p5} p - The p5.js instance.
 * @param {number} _num - 円の数
 * @param {number} _w - 円を配置する幅の範囲
 * @param {number} _h - 円を配置する高さの範囲
 */
const getRandomCircles = (p, _num, _w, _h) => {
  let circles = [];
  for (let i = 0; i < _num; i++) {
    let x = p.random(-1, 1) * _w;
    let y = p.random(-1, 1) * _h;
    let z = p.random(30, 150); // z軸の値を円の大きさとして使用
    if (circles.every((c) => p.dist(x, y, c.x, c.y) > (z + c.z) * 0.5)) {
      circles.push(p.createVector(x, y, z));
    }
  }
  return circles;
};
