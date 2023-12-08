import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { ratioCalculation } from './utils/ratioCalculation';

// pixiを使ったサンプル作成
export const sketch = () => {
  let app = []; // pixiアプリケーションを格納する変数
  let img; // 画像を格納する変数

  const canvas = document.getElementById('canvas'); // canvas要素を取得
  const frame = { count: 5 }; // モーション用のカウンター
  const imgReso = {
    width: 1216,
    height: 832,
  }; // 画像の解像度

  const init_app = {
    width: imgReso.width,
    height: imgReso.height,
    backgroundColor: 0x061639,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
  };

  // 画面サイズに合わせてcanvasのサイズを変更
  init_app.width = window.innerWidth;
  console.log(window.innerWidth);
  init_app.height = ratioCalculation(init_app.width, imgReso.height, imgReso.width);

  // setup関数とdraw関数を定義
  const setup = () => {
    app = new PIXI.Application(init_app); // pixiアプリケーションを作成
    canvas.appendChild(app.view); // canvas要素をDOMに追加
    globalThis.__PIXI_APP__ = app;

    motion(frame); // モーションを作成
    console.log(app.screen.width, app.screen.height);

    // https://pixijs.com/playground?source=undefined&exampleId=textures.textureRotate
    const path = '../../mocks/pixi_test3/images/test1.png';
    PIXI.Assets.load(path).then((texture) => {
      const bg1 = new PIXI.Texture(texture.baseTexture);
      img = new PIXI.Sprite(bg1);
      app.stage.addChild(img);
    });
  };

  const draw = () => {
    // ここに描画処理を記述
    app.ticker.add(() => {
      // img.width = window.innerWidth;
      // img.height = ratioCalculation(img.width, imgReso.height,imgReso.width);
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
