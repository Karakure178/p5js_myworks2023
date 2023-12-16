import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { ratioCalculation } from './utils/ratioCalculation';
import { map } from './utils/map';

let img_path = [
  '../../mocks/pixi_test7/images/test1.png',
  '../../mocks/pixi_test7/images/test2.png',
  '../../mocks/pixi_test7/images/test3.png',
  '../../mocks/pixi_test7/images/test4.png',
  '../../mocks/pixi_test7/images/test5.png',
  '../../mocks/pixi_test7/images/test6.png',
];
let is_texture = false;
let img_list = []; // PIXI.Textureクラスを入れる配列
let filter2;
let img_count = 1;

/**pixiを使ったサンプル作成
 * @class Sketch
 */
export class Sketch {
  constructor() {
    this.app;
    this.filter;

    this.is_img;
    this.img_path;
    this.img_list;
    this.is_loadImg;

    this._init();
    this.resize();
    this._addEvent();
    this.ticker();
  }

  /**
   * @method _init
   * @memberof Sketch
   * @protected
   * @description
   * 初期化
   */
  _init() {
    this.app = new PIXI.Application(this._init_app()); // pixiアプリケーションを作成
    const canvas = document.getElementById('canvas'); // canvas要素を取得
    canvas.appendChild(this.app.view); // canvas要素をDOMに追加
    globalThis.__PIXI_APP__ = this.app;
  }

  /**
   * @method resize
   * @description
   * 全体のリサイズ処理
   */
  resize() {
    // pc用
    const width = window.innerWidth;
    const normal_width = width;
    const normal_height = ratioCalculation(width, 1920, 1080);
    const ratio = normal_width / normal_height; // 画面の縦横比(予備)
    this.app.renderer.resize(normal_width, normal_height);
  }

  /**
   * @method _init_app
   * @memberof Sketch
   * @protected
   * @return setting
   * @description
   * pixiアプリケーションの設定を初期化する関数
   */
  _init_app() {
    const setting = {
      width: window.innerWidth,
      height: ratioCalculation(window.innerWidth, 1920, 1080),
      backgroundColor: 0x061639,
      antialias: true,
      resolution: 1,
      resizeTo: window,
    };
    return setting;
  }

  /**
   * @method _addEvent
   * @memberof Sketch
   * @protected
   * @description
   * イベントを追加する関数
   */
  _addEvent() {
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  /**
   * @method ticker
   * @description
   * pixiアプリケーションを繰り返し実行する関数
   */
  ticker() {
    this.app.ticker.add(() => {
      //
    });
  }
}

const sketch = () => {
  let app = []; // pixiアプリケーションを格納する変数
  let img; // 画像を格納する変数
  let is_img = false;

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
    resizeTo: window,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  };

  // 画面サイズに合わせてcanvasのサイズを変更
  init_app.width = window.innerWidth;
  init_app.height = ratioCalculation(init_app.width, imgReso.height, imgReso.width);

  window.addEventListener('resize', () => {});

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
      const path = '../../mocks/pixi_test7/images/test1.png';
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
      let disp;
      PIXI.Assets.load(disp_path).then((texture) => {
        disp = new PIXI.Texture(texture.baseTexture);
      });

      for (let i = 0; i < img_path.length; i++) {
        // 読み込みタイミングで配列の中身の順番が変わる...
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
            motion(frame); // モーションを作成
          }
        }, 100);
      }
    };

    init(); // pixiアプリケーションを初期化
    imgLoad(); // 画像を読み込む
    textureLoad(); // シェーダーに使う画像を読み込む
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
    delay: 1,
    onComplete: () => {
      // アニメーション終了時
      // 画像を切り替える
      console.log('画像を切り替えます', img_count);
      if (img_count > img_list.length - 2) {
        img_count = 0;
        filter2.uniforms.texture1 = img_list[img_list.length - 1];
        filter2.uniforms.texture2 = img_list[0];
      } else {
        filter2.uniforms.texture1 = img_list[img_count];
        filter2.uniforms.texture2 = img_list[img_count + 1];
        img_count++;
      }
    },
  });
};

const onAssetsLoaded = (app, disp, img, frame) => {
  const filter = new PIXI.Filter(null, sample_frag, {
    u_time: 0,
    u_tex: img[1],
    u_resolution: [app.screen.width, app.screen.height],
  });

  app.stage.filterArea = app.renderer.screen;
  app.stage.filters = [filter]; // 重ねたい順番に記述

  app.ticker.add(() => {
    const time = frame.count;
    filter2.uniforms.dispFactor = time;
  });
};

// test用のフラグメントシェーダー
const sample_frag = `
varying vec2 vTextureCoord;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;
float PI = 3.14159265358979;
void main() {
  vec2 uv = vTextureCoord;
  vec4 tex = texture2D(u_tex, uv);
  gl_FragColor = tex;
}
`;
