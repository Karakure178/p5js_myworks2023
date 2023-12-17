import * as PIXI from 'pixi.js';
import { ratioCalculation } from './utils/ratioCalculation';
import { Bear } from './shapes/bear';

/**pixiを使ったサンプル作成
 * 画面をクリックするとくまが増えるサンプル
 * @class Sketch
 */
export class Sketch {
  constructor() {
    this.app;
    this.animation;
    this.colors = [
      [0x9ec8b9, 0x5c8374, 0x092635],
      [0xf0ece5, 0xb6bbc4, 0x161a30],
      [0xecf4d6, 0x9ad0c2, 0x2d9596],
      [0xf05941, 0xbe3144, 0x872341],
      [0xffc7c7, 0xed9ed6, 0xc683d7],
      [0xf5f5f5, 0xf99417, 0x4d4c7d],
      [0xf7e987, 0x5b9a8b, 0x445069],
      [0x8cabff, 0x4477ce, 0x512b81],
    ];

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
    globalThis.__PIXI_APP__ = this.app;
    const canvas = document.getElementById('canvas'); // canvas要素を取得
    canvas.appendChild(this.app.view); // canvas要素をDOMに追加
    this.setAnimation();
    // テストコード
    const path = '../../mocks/pixi_test7/images/test1.png';
    PIXI.Assets.load(path).then((texture) => {
      const bg1 = new PIXI.Texture(texture.baseTexture);
      const img = new PIXI.Sprite(bg1);
      console.log(bg1.width);
      this.app.stage.addChild(img);
    });
  }

  /**
   * @method setAnimation
   * @memberof Sketch
   * @description
   * アニメーションをセットする関数
   * 今回はクリックイベントをセットしている
   */
  setAnimation() {
    this.app.stage.eventMode = 'static';
    this.app.stage.cursor = 'pointer';

    // https://pixijs.com/examples/events/click
    this.app.stage.on('pointerdown', (e) => {
      console.log('appがクリックされました', e);

      const points = e.data.getLocalPosition(e.currentTarget);
      console.log(points.x, points.y);

      const index = Math.round(Math.random() * (this.colors.length - 1));
      new Bear({ app: this.app, colors: this.colors[index] }).draw(points.x, points.y);
    });
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
    const normal_height = ratioCalculation(width, 1080, 1920);
    const ratio = normal_width / normal_height; // 画面の縦横比(予備)

    console.log('halllo', normal_height);
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
      height: ratioCalculation(window.innerWidth, 1080, 1920),
      backgroundColor: 0x061639,
      antialias: true,
      resolution: 1,
    };
    return setting;
    //resizeTo: window, // これがあると全画面になる...
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
