import * as PIXI from 'pixi.js';

/**
 * @class Shader
 * @description
 * シェーダー用クラス<br>
 */
export class Shader {
  /**
   * @constructor
   * @param {PIXI.Application} app - アプリケーション
   * @param {Object} uniforms - シェーダーに渡す値
   * @param {String} vertex - 頂点シェーダー
   * @param {String} fragment - フラグメントシェーダー
   */
  constructor({ app, uniforms, vertex, fragment, container = null }) {
    this.app = app;
    this.uniforms = uniforms;
    this.vertex = vertex;
    this.fragment = fragment;
    this.filter;
    this.container = container;
    this.setShader();
  }

  /**
   * @memberof Shader
   * @method setShader
   * @description
   * シェーダーをセットする関数、キャンバス全体に適用する<br>
   * コンテナがある場合はコンテナだけに適用させる
   */
  setShader() {
    this.filter = new PIXI.Filter(null, this.fragment, this.uniforms);
    if (this.container !== null) {
      this.container.filterArea = this.container.renderer.screen;
      this.container.filters = [this.filter];
    } else {
      this.app.stage.filterArea = this.app.renderer.screen;
      this.app.stage.filters = [this.filter];
    }
  }

  /**
   * @memberof Shader
   * @method ticker
   * @description
   * シェーダーのアニメーションを行う関数,uniformsの値を変更する
   */
  ticker() {
    //this.filter.uniforms.u_time += 0.01;
  }
}
