import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { circleVector, circleVectorDraw, interpolatedData_num } from './circle';

// pixiを使ったサンプル作成
export const sketch = () => {
  let app = []; // pixiアプリケーションを格納する変数
  let circle1; // 円を描画するためのpixi.jsのGraphicsクラス
  let projectionTransform;
  let rotation = 0;
  let width, height;

  const canvas = document.getElementById('canvas'); // canvas要素を取得
  const frame = { count: 0 }; // モーション用のカウンター

  // setup関数とdraw関数を定義
  const setup = () => {
    app = new PIXI.Application(); // pixiアプリケーションを作成
    app.renderer.resize(800, 600); // キャンバスサイズを指定
    app.renderer.background.color = 0x061639; // 背景色を指定
    canvas.appendChild(app.view); // canvas要素をDOMに追加
    globalThis.__PIXI_APP__ = app;

    circle1 = new PIXI.Graphics();
    app.stage.addChild(circle1);

    circleVector(app, circle1); // 円を描画
    motion(frame); // モーションを作成

    width = app.screen.width;
    height = app.screen.height;
    projectionTransform = new PIXI.Matrix();
  };

  const draw = () => {
    // ここに描画処理を記述
    app.ticker.add(() => {
      circleVectorDraw(circle1, parseInt(frame.count));
      // 実行順序が大事参考: https://codepen.io/sukantpal/pen/ZEQvKBB?editors=1010
      projectionTransform.identity();
      projectionTransform.rotate(rotation);
      projectionTransform.translate(width / 2, height / 2);
      rotation += 0.01;
      app.stage.transform.setFromMatrix(projectionTransform);
    });
  };

  setup(); // pixiアプリケーションをセットアップ
  draw(); // pixiアプリケーションを描画
};

// gsapを使ったモーション作成
const motion = (frame) => {
  // ここにモーション処理を記述
  gsap.timeline({ repeat: -1 }).to(frame, {
    count: interpolatedData_num - 1,
    duration: 3,
    ease: 'expo.inOut',
  });
};
