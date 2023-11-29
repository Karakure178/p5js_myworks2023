import * as PIXI from 'pixi.js';
import { circleVector } from './circle';

// pixiを使ったサンプル作成
export const sketch = () => {
  let app = []; // pixiアプリケーションを格納する変数
  const canvas = document.getElementById('canvas'); // canvas要素を取得

  // setup関数とdraw関数を定義
  const setup = (app) => {
    app = new PIXI.Application(); // pixiアプリケーションを作成
    app.renderer.resize(800, 600); // キャンバスサイズを指定
    app.renderer.background.color = 0x061639; // 背景色を指定
    canvas.appendChild(app.view); // canvas要素をDOMに追加

    const circle1 = new PIXI.Graphics();
    circleVector(app, circle1); // 円を描画
  };

  const draw = (app) => {
    // ここに描画処理を記述
  };

  setup(app); // pixiアプリケーションをセットアップ
  draw(app); // pixiアプリケーションを描画
};
