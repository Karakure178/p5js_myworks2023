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
    this.tex;
    this.load = false;
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

    const path = '../../mocks/pixi_test7/images/test2.png';
    PIXI.Assets.load(path).then((texture) => {
      this.tex = new PIXI.Texture(texture.baseTexture);
      this.load = true;
    });

    const timerId = setInterval(() => {
      if (this.load) {
        clearInterval(timerId);
        console.log('points');
        this.filter = new Fisheye({
          app: this.app,
          container: this.container,
          uniforms: { center: [-100, -100], u_tex: this.tex },
        });

        this.container.on('pointerdown', (e) => {
          const points = e.data.getLocalPosition(e.currentTarget);
          this.filter = new Fisheye({
            app: this.app,
            container: this.container,
            uniforms: { center: [points.x, points.y], u_tex: this.tex },
          });
        });
      }
    }, 100);
  }
}
