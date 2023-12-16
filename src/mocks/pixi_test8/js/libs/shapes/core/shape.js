import * as PIXI from 'pixi.js';
/**
 * @class Shape
 * @description
 * 形状用クラス<br>
 */
class Shape {
  /**
   * @constructor
   * @param {PIXI.Application} app - アプリケーション
   * @param {PIXI.Container} container - コンテナ
   * @param {Array} vertexes - 頂点数
   * @param {String} color - 色
   * @param {String} path - パス
   */
  constructor(app, container = null, vertexes = null, color = null, path = null) {
    this.app = app;
    this.width;
    this.height;
    this.container = container;
    this.vertexes = vertexes;
    this.color = color;
    this.path = path;
    this.shape;
    this._init();
    this._set();
  }

  /**
   * @memberof Shape
   * @method _init
   * @protected
   * @description
   * 形状をセットする関数
   */
  _init() {
    //
  }

  /**
   * @memberof Shape
   * @method _set
   * @protected
   * @description
   * 形状をapp or containerにセットする関数
   */
  _set() {
    // pathを読み込まない場合はそのまま設定する
    // pathがある場合は遅延処理があるのでオーバーライドしてもらう
    // コンテナに入れない場合は、app.stageに入れる
    if (this.path === null) {
      if (this.container !== null) {
        this.container.addChild(this.shape);
      } else {
        this.app.stage.addChild(this.shape);
      }
    }
  }

  /**
   * @memberof Shape
   * @method _update
   * @param {Object} windowSize - ウインドウサイズ
   * @param {Number} windowSize.width - ウインドウの横幅
   * @param {Number} windowSize.height - ウインドウの縦幅
   * @protected
   * @description
   * ウインドウサイズを変更する関数
   * **/
  _update(windowSize) {
    this.width = windowSize.width;
    this.height = windowSize.height;
  }

  /**
   * @memberof Shape
   * @method resize
   * @param {Object} windowSize - ウインドウサイズ
   * @param {Number} windowSize.width - ウインドウの横幅
   * @param {Number} windowSize.height - ウインドウの縦幅
   * @description
   * ウインドウサイズを変更した結果を図形に反映させる関数
   * **/
  resize(windowSize) {
    this._update(windowSize);
  }

  /**
   * @memberof Shape
   * @method ticker
   * @description
   * 形状をセットする関数
   */
  ticker() {
    //
  }
}
