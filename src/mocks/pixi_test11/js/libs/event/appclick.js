import { Bear } from '../shapes/bear';
import { Fisheye } from '../filters/fisheye';
import * as PIXI from 'pixi.js';

/**
 * @class AppClick
 * @description
 * クリックイベント用クラス
 * コンテナに対してクリックイベントを追加する
 */
export class AppClick {
  constructor(app, container) {
    this.app = app;
    this.container = container;
    this.filter;

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
  }

  /**
   * @method addEvent
   * @memberof AppClick
   * @protected
   * @description
   * コンテナにイベントを追加する関数
   * 今回はシェーダーに噛ます
   */
  addEvent() {
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    this.container.on('pointerdown', (e) => {
      const points = e.data.getLocalPosition(e.currentTarget);

      const index = Math.round(Math.random() * (this.colors.length - 1));
      new Bear({ app: this.app, colors: this.colors[index], container: this.container }).draw(points.x, points.y);
      console.log(points.x, points.y);

      this.filter = new Fisheye({
        app: this.app,
        container: this.container,
        uniforms: { center: [points.x, points.y] },
      });
    });
  }
}
