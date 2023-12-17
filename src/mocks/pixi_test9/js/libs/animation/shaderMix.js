import * as PIXI from 'pixi.js';
import { OldImage } from '../shapes/image';
import { img_path, disp_path } from '../../parameters';
import { Distortion } from '../filters/distortion';
import { Fisheye } from '../filters/fisheye';
import { ContainerToTexture } from '../core/convertTex';
/**
 * @class ShaderMix
 * @description
 * 画像にshaderかけてそれを読み込みこんでアニメーションさせるためのクラス
 */
export class ShaderMix {
  constructor(app) {
    this.app = app;
    this.disp = new OldImage({ app: app, path: disp_path, is_tex: true });

    this.img_path = img_path;
    this.img_list = []; // 画像のテクスチャを入れるリスト
    this.eye_list = []; // 魚眼処理かけたテクスチャを入れるリスト

    this.filter; //
    this.is_filter = false; // フィルターを適用されたかどうか
    this._init();
  }

  /**
   * @method _init
   * @memberof ShaderMix
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
        for (let i = 0; i < this.img_list.length; i++) {
          const container = new PIXI.Container();
          this.app.stage.addChild(container);

          container.addChild(new PIXI.Sprite(this.img_list[i].img));

          new Fisheye({ app: this.app, container: container, tex: this.img_list[i] });
          const convert = new ContainerToTexture({
            app: this.app,
            width: this.img_list[i].img.width,
            height: this.img_list[i].img.height,
          });
          const tex = convert.convert(container);

          this.eye_list.push(tex);
        }
        this._setShader();
      }
    }, 100);
  }

  /**
   * @method setShader
   * @memberof ShaderMix
   * @protected
   * @description
   * シェーダーをセットする関数、キャンバス全体に適用する<br>
   */
  _setShader() {
    this.filter = new Distortion({ app: this.app, disp: this.disp, img_list: this.eye_list });
    this.is_filter = true;
  }

  /**
   * @method ticker
   * @memberof ShaderMix
   * @description
   * シェーダーのアニメーションを行う関数,uniformsの値を変更する
   */
  ticker() {
    if (this.is_filter) this.filter.ticker();
  }
}
