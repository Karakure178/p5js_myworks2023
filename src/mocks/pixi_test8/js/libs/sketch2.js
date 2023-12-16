import * as PIXI from 'pixi.js';
import { ratioCalculation } from './utils/ratioCalculation';
import { LoadImg } from './animation/loadImg';

/**pixiを使ったサンプル作成
 * @class Sketch
 */
export class Sketch {
  constructor() {
    this.app;
    this.animation;

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
    this.setAnimation();

    // テストコード
    const path = '../../mocks/pixi_test7/images/test1.png';
    PIXI.Assets.load(path).then((texture) => {
      const bg1 = new PIXI.Texture(texture.baseTexture);
      const img = new PIXI.Sprite(bg1);
      this.app.stage.addChild(img);
    });
  }

  /**
   * @method setAnimation
   * @memberof Sketch
   * @description
   * アニメーションをセットする関数
   */
  setAnimation() {
    this.animation = new LoadImg(this.app);
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
      this.animation.ticker();
    });
  }
}
