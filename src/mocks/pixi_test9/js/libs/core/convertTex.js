import * as PIXI from 'pixi.js';

// 通常のコンテナをテクスチャーに変換するクラス
// https://qiita.com/inwan78/items/53a6e74b365cfed1e1b2
export class ContainerToTexture {
  constructor({ app, width, height }) {
    // this.width;
    // this.height;
    this.texture;
    this.app = app;
    this.resize(width, height);
  }
  /**
   * コンテナをテクスチャーに変換する
   * @param container 変換するcontainer
   * @returns 生成したテクスチャー
   */
  convert(container) {
    console.log(this.app, 'this.texture');
    this.app.renderer.render(container, this.texture);
    return this.texture;
  }
  //テクスチャーのサイズを変更
  resize(width, height) {
    this.texture = new PIXI.RenderTexture(new PIXI.BaseRenderTexture({ width: width, height: height }));
  }
}
