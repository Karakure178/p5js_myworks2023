import { Shape } from '../core/shape';
import * as PIXI from 'pixi.js';
/**
 * @class Bear
 * @description
 * くまを描くクラス<br>
 * Shapeクラスを継承している
 */
export class Bear extends Shape {
  /**
   * @constructor
   * @param {PIXI.Application} app - アプリケーション
   * @param {Number} vertexes - 頂点数
   * @param {Number} radius - 半径
   * @param {Number} colors - 色
   */
  constructor({ app, colors }) {
    super({ app: app });
    this.radius = Math.random() * 100 + 50;
    this.colors = colors;
    this.pg = new PIXI.Graphics();
    this.app.stage.addChild(this.pg);
  }

  /**
   * @method draw
   * @memberof Bear
   * @param {Number} x - くまを描く中心座標x
   * @param {Number} y - くまを描く中心座標y
   * @description
   * くまを描く関数
   */
  draw(x, y) {
    /**
     * くまさんを作る
     * @param {number} x - くまを呼び出す中心座標x
     * @param {number} y - くまを呼び出す中心座標y
     * @param {number} r - くまの直径
     * @param {p5.Graphics} pg - PIXI.Graphics
     * @param {Array} colors - カラーの配列(16進数)
     */
    const bear = (x, y, r, pg, colors) => {
      const ear_width = r / 1.5;
      const ear_height = y - r / 1.2;
      const nose_height = y + r / 10;
      const mouth_height = nose_height + r / 20;

      // 耳
      const ear = () => {
        // 両耳(外枠)
        const left_ear = x - ear_width;
        const right_ear = x + ear_width;

        pg.beginFill(colors[0]);
        pg.drawCircle(left_ear, ear_height, r / 3);
        pg.drawCircle(right_ear, ear_height, r / 3);
        pg.endFill();

        // 両耳(内枠)
        const left_ear_small = x - ear_width;
        const right_ear_small = x + ear_width;

        pg.beginFill(colors[1]);
        pg.drawCircle(left_ear_small, ear_height, r / 4);
        pg.drawCircle(right_ear_small, ear_height, r / 4);
        pg.endFill();
      };
      ear();

      // 土台
      pg.beginFill(colors[0]);
      pg.drawEllipse(x, y, r, r / 1.2);
      pg.endFill();

      // 鼻
      const nose = () => {
        pg.beginFill(colors[2]);
        pg.drawCircle(x, nose_height + 3, r / 20);
        pg.endFill();
      };
      nose();

      // 口(枠なし)
      const mouth = () => {
        pg.lineStyle(2, colors[2], 1, 1);
        pg.moveTo(x, mouth_height);
        pg.lineTo(x - r / 5, nose_height + r / 5);
        pg.lineStyle();

        pg.lineStyle(2, colors[2], 1, 0);
        pg.moveTo(x, mouth_height);
        pg.lineTo(x + r / 5, nose_height + r / 5);
        pg.lineStyle();
        pg.endFill();
      };
      mouth();

      const right_eye = () => {
        // 枠線
        pg.beginFill(0x000000);
        pg.drawCircle(x - r / 3, y - r / 20 - 3, r / 5);
        pg.endFill();
        // 白目
        pg.beginFill(0xffffff);
        pg.arc(x - r / 3, y - r / 20 - 3, r / 5.5, -Math.PI / 11, Math.PI);
        pg.endFill();

        // 黒目
        pg.beginFill(colors[2]);
        pg.arc(x - r / 3, y - r / 20 - 5, r / 13, -Math.PI / 10, Math.PI);
        pg.endFill();
      };
      right_eye();

      const left_eye = () => {
        // 枠線
        pg.beginFill(0x000000);
        pg.drawCircle(x + r / 3, y - r / 20 - 3, r / 5);

        //pg.arc(x+r/3 , y-r/20-3, r/5, Math.PI/10, Math.PI,20);
        pg.endFill();

        // 白目
        pg.beginFill(0xffffff);
        pg.arc(x + r / 3, y - r / 20 - 3, r / 5.5, Math.PI / 10, Math.PI);
        pg.endFill();

        // 黒目
        pg.beginFill(colors[2]);
        pg.arc(x + r / 3, y - r / 20 - 3, r / 13, Math.PI / 10, Math.PI);
        pg.endFill();
      };
      left_eye();
    };
    bear(x, y, this.radius, this.pg, this.colors);
  }
}
