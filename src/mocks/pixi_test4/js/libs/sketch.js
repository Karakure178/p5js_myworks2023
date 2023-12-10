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
    resolution: 1,
  };
  //  resolution: window.devicePixelRatio || 1,

  // 画面サイズに合わせてcanvasのサイズを変更
  init_app.width = window.innerWidth;
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
    onAssetsLoaded(app);
  };

  // ここに描画処理を記述
  const draw = () => {
    app.ticker.add(() => {
      //img.width = 1000; //window.innerWidth;
      //img.height = ratioCalculation(img.width, imgReso.height, img.width);
    });
  };

  setup(); // pixiアプリケーションをセットアップ
  // draw(); // pixiアプリケーションを描画
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

const onAssetsLoaded = (app) => {
  // Build the filter
  const filter = new PIXI.Filter(null, fragment, {
    u_time: 0.0,
    u_resolution: [app.screen.width, app.screen.height],
  });
  app.stage.filterArea = app.renderer.screen;
  app.stage.filters = [filter];

  // Listen for animate update.
  let totalTime = 0;
  app.ticker.add((delta) => {
    filter.uniforms.u_time = totalTime;
    totalTime += delta / 60;
  });
};

/*
 * filter定義
  https://pixijs.com/examples/filters-advanced/shader-toy-filter-render-texture
 */
const fragment = `
  varying vec2 vTextureCoord;
  uniform sampler2D u_tex;
  uniform float u_time;
  uniform vec2 u_resolution;

  float PI = 3.14159265358979;

  void main() {
    vec2 uv = vTextureCoord;
    vec4 tex = texture2D(u_tex, uv);

    // 走査線を書く
    float scanLineInterval = 1500.0; // 大きいほど幅狭く
    float scanLineSpeed = u_time * 5.0; // 走査線移動速度
    float scanLine = max(1.0, sin(uv.y * scanLineInterval + scanLineSpeed) * 1.6);

    tex.rgb *= scanLine;


    gl_FragColor = tex;
  }
`;
