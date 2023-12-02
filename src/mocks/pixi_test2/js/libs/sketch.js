import gsap from 'gsap';
import * as PIXI from 'pixi.js';

// pixiを使ったサンプル作成
export const sketch = () => {
  let app = []; // pixiアプリケーションを格納する変数
  let width, height;
  const stars = [{ x: 0, y: 0, r1: 5, r2: 100, np: 10, speed: 0.01 }];
  const starShape = [];

  const canvas = document.getElementById('canvas'); // canvas要素を取得
  const frame = { count: 5 }; // モーション用のカウンター

  const init_app = {
    width: 800,
    height: 600,
    backgroundColor: 0x061639,
    resolution: window.devicePixelRatio || 1,
    antialias: true,
  };

  // setup関数とdraw関数を定義
  const setup = () => {
    app = new PIXI.Application(init_app); // pixiアプリケーションを作成
    app.renderer.resize(800, 600); // キャンバスサイズを指定
    canvas.appendChild(app.view); // canvas要素をDOMに追加

    globalThis.__PIXI_APP__ = app;

    motion(frame); // モーションを作成
    width = app.screen.width;
    height = app.screen.height;

    stars.forEach((s, index) => {
      s.x = app.screen.width / 2;
      s.y = app.screen.height / 2;
      starShape.push(star(0, 0, s.r1, s.r2, s.np));
      starShape[index].position.set(s.x, s.y);
      starShape[index].pivot.set(0, 0);
      app.stage.addChild(starShape[index]);
    });
  };

  const draw = () => {
    // ここに描画処理を記述
    stars.forEach((s, index) => {
      app.ticker.add(() => {
        starShape[index].rotation = frame.count;
      });
    });
  };

  setup(); // pixiアプリケーションをセットアップ
  draw(); // pixiアプリケーションを描画
};

// gsapを使ったモーション作成
const motion = (frame) => {
  // ここにモーション処理を記述
  gsap.timeline({ repeat: -1 }).to(frame, {
    count: 1,
    duration: 3,
    ease: 'expo.inOut',
  });
};

const star = (x, y, radius1, radius2, npoints) => {
  const shape = new PIXI.Graphics();
  const angle = (Math.PI * 2) / npoints;
  const halfAngle = angle / 2.0;

  shape.beginFill(0xffffff);
  for (let a = 0; a < Math.PI * 3; a += angle) {
    let sx = x + Math.cos(a) * radius2;
    let sy = y + Math.sin(a) * radius2;
    shape.lineTo(sx, sy);
    sx = x + Math.cos(a + halfAngle) * radius1;
    sy = y + Math.sin(a + halfAngle) * radius1;
    shape.lineTo(sx, sy);
  }
  shape.endFill();
  return shape;
};
