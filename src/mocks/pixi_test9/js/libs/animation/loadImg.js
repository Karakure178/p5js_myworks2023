import * as PIXI from 'pixi.js';
import { OldImage } from '../shapes/image';
import { img_path, disp_path } from '../../parameters';
import { Distortion } from '../filters/distortion';

/**
 * @class LoadImg
 * @description
 * 画像読み込みこんでアニメーションさせるためのクラス
 *
 */
export class LoadImg {
  constructor(app) {
    this.app = app;
    this.disp = new OldImage({ app: app, path: disp_path, is_tex: true });
    // this.display = new Image({ app: app, container: this.container, path: img_path[0], is_tex: false });

    this.img_path = img_path;
    this.img_list = []; // 画像のテクスチャを入れるリスト
    this.filter; //
    this.is_filter = false; // フィルターを適用されたかどうか
    this._init();
  }

  /**
   * @method _init
   * @memberof LoadImg
   * @protected
   * @description
   * 初期化
   */
  _init() {
    for (let i = 0; i < this.img_path.length; i++) {
      this.img_list.push(new OldImage({ app: this.app, path: this.img_path[i], is_tex: true }));
    }

    const timerId = setInterval(() => {
      // 全て読み込まれたか確認してからシェーダーをセットする
      const is_totalLoad = this.img_list.every((img) => img.is_load);
      if (is_totalLoad && this.disp.is_load) {
        clearInterval(timerId);
        this._setShader();
      }
    }, 100);
  }

  /**
   * @method setShader
   * @memberof LoadImg
   * @protected
   * @description
   * シェーダーをセットする関数、キャンバス全体に適用する<br>
   */
  _setShader() {
    this.filter = new Distortion({ app: this.app, disp: this.disp, img_list: this.img_list });
    this.is_filter = true;
  }

  /**
   * @method ticker
   * @memberof LoadImg
   * @description
   * シェーダーのアニメーションを行う関数,uniformsの値を変更する
   */
  ticker() {
    // TODO resize時に画像比率を直す
    if (this.is_filter) this.filter.ticker();
  }
}
