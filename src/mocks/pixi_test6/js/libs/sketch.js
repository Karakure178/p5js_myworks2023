import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { ratioCalculation } from './utils/ratioCalculation';
import { map } from './utils/map';

let img_path = [
  '../../mocks/pixi_test5/images/test1.png',
  '../../mocks/pixi_test5/images/test2.png',
  '../../mocks/pixi_test5/images/test3.png',
];

// pixiを使ったサンプル作成
export const sketch = () => {
  let app = []; // pixiアプリケーションを格納する変数
  let img; // 画像を格納する変数
  let is_img = false;
  const img_list = []; // PIXI.Textureクラスを入れる配列

  const disp_path = 'https://pixijs.com/assets/perlin.jpg';

  const canvas = document.getElementById('canvas'); // canvas要素を取得
  const frame = { count: 0 }; // モーション用のカウンター
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
    resizeTo: window,
  }; //  resolution: window.devicePixelRatio || 1,

  // 画面サイズに合わせてcanvasのサイズを変更
  init_app.width = window.innerWidth;
  init_app.height = ratioCalculation(init_app.width, imgReso.height, imgReso.width);

  // setup関数とdraw関数を定義
  const setup = () => {
    const init = () => {
      app = new PIXI.Application(init_app); // pixiアプリケーションを作成
      canvas.appendChild(app.view); // canvas要素をDOMに追加
      globalThis.__PIXI_APP__ = app;
    };

    // 画像を読み込む
    const imgLoad = () => {
      // https://pixijs.com/playground?source=undefined&exampleId=textures.textureRotate
      const path = '../../mocks/pixi_test3/images/test1.png';
      PIXI.Assets.load(path).then((texture) => {
        const bg1 = new PIXI.Texture(texture.baseTexture);
        img = new PIXI.Sprite(bg1);
        app.stage.addChild(img);

        // 画像が読み込まれたらtrueにする
        is_img = true;
      });

      // 画像がクリックされた時の処理（遅延読み込み対策あり）
      if (!is_img) {
        const timeid = setInterval(() => {
          if (is_img) {
            clearInterval(timeid);

            // v7では以下のように書く
            img.eventMode = 'static';
            img.cursor = 'pointer';

            // https://pixijs.com/examples/events/click
            img.on('pointerdown', (e) => {
              console.log('imgがクリックされました', e);
            });
          }
          console.log('画像が読み込まれていません');
        }, 100);
      }
    };

    // シェーダーに使う画像を読み込む
    const textureLoad = () => {
      let is_texture = false;
      let disp;
      PIXI.Assets.load(disp_path).then((texture) => {
        disp = new PIXI.Texture(texture.baseTexture);
      });

      // for (let i = 0; i < img_path.length; i++) {
      //   const t = PIXI.Texture.from(img_path[i]);
      //   img_list.push(t);
      // }
      // onAssetsLoaded(app, disp, img_list, frame);

      for (let i = 0; i < img_path.length; i++) {
        PIXI.Assets.load(img_path[i]).then((texture) => {
          const img = new PIXI.Texture(texture.baseTexture);
          img_list.push(img);
          if (i === img_path.length - 1) {
            is_texture = true;
          }
        });
      }

      if (!is_texture) {
        const timeid = setInterval(() => {
          if (is_texture) {
            clearInterval(timeid);
            onAssetsLoaded(app, disp, img_list, frame);
          }
        }, 100);
      }
    };

    init(); // pixiアプリケーションを初期化
    motion(frame); // モーションを作成
    imgLoad(); // 画像を読み込む
    textureLoad(); // シェーダーに使う画像を読み込む
    //
  };

  // ここに描画処理を記述
  const draw = () => {
    app.ticker.add(() => {
      // 画像読み込み遅延用処理噛まさないとエラー吐く
      if (is_img) {
        img.width = app.screen.width;
        img.height = ratioCalculation(img.width, imgReso.height, imgReso.width);
      }
    });
  };

  setup(); // pixiアプリケーションをセットアップ
  draw(); // pixiアプリケーションを描画
};

// gsapを使ったモーション作成
const motion = (frame) => {
  gsap.timeline({ repeat: -1 }).to(frame, {
    count: 1,
    duration: 3,
    ease: 'quad.inOut',
    onRepeat: () => {
      console.log('onComplete!!');
    },
  });
};

const onAssetsLoaded = (app, disp, img, frame) => {
  // 画像を動かす用のfilter
  const filter2 = new PIXI.Filter(null, fragment2, {
    dispFactor: 0.0,
    dpr: 1.0,
    disp: disp,
    texture1: PIXI.Texture.from(img_path[0]),
    texture2: PIXI.Texture.from(img_path[1]),
    angle1: 0.0,
    angle2: 0.0,
    intensity1: 1.0,
    intensity2: 1.0,
    res: [app.screen.width, app.screen.height, 1.0, 1.0],
  });

  app.stage.filterArea = app.renderer.screen;
  app.stage.filters = [filter2]; // 重ねたい順番に記述

  app.ticker.add(() => {
    const time = frame.count;
    filter2.uniforms.dispFactor = time;
  });
};

// 画像を動かす用のフラグメントシェーダー
const fragment2 = `
  varying vec2 vTextureCoord;

  uniform float dispFactor; // bool = trueなら動く
  uniform float dpr;
  uniform sampler2D disp;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float angle1;
  uniform float angle2;
  uniform float intensity1;
  uniform float intensity2;
  uniform vec4 res;

  float PI = 3.14159265358979;

mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 vUv = vTextureCoord;
  vec4 disp = texture2D(disp, vUv);
  vec2 dispVec = vec2(disp.r, disp.g);

  vec2 uv = gl_FragCoord.xy / (res.xy) ;
  vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);

  vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;
  vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);

  vec4 _texture1 = texture2D(texture1, distortedPosition1);
  vec4 _texture2 = texture2D(texture2, distortedPosition2);

  gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
`;
