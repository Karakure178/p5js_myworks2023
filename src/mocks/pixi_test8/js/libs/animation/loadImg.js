import * as PIXI from 'pixi.js';
import { Image } from '../shapes/image';
import { img_path } from '../../parameters';
/**
 * @class LoadImg
 * @description
 * 画像読み込みこんでアニメーションさせるためのクラス
 */
class LoadImg {
  constructor(app) {
    this.app = app;
    this.container = new PIXI.Container();
    this.display = new Image(app, this.contaier, img_path[0], true);

    this.img_path = img_path;
    this.img_list = []; // 画像のテクスチャを入れるリスト
  }

  _init() {
    for (let i = 0; i < this.img_path.length; i++) {
      this.img_list.push(new Image(app, this.img_path[i], false));
    }
  }
}
