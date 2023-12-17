import { Shape } from '../core/shape';
import { radians } from '../utils/radians';
import * as PIXI from 'pixi.js';

/**
 * @class Hexagon
 * @description
 * 六角形を描くクラス<br>
 * Shapeクラスを継承している
 */
export class Hexagon extends Shape {
  /**
   * @constructor
   * @param {PIXI.Application} app - アプリケーション
   * @param {{x:Number,y:Number}} center - 中心座標
   * @param {Number} radius - 半径
   * @param {Number} color - 色
   */
  constructor({ app: app, container: container, center: center, radius: radius, color: color }) {
    super({ app: app, container: container, color: color });
    this.radius = radius;
    this.pg;
    this.center = center;
    this._init();
  }

  /**
   * @method _init
   * @memberof Hexagon
   * @description
   * @override
   * 六角形を描く関数
   */
  _init() {
    this.pg = new PIXI.Graphics();
    this.pg.beginFill(this.color);
    this.pg.drawPolygon(this._createHexagon());
    this.pg.endFill();
    this.shape = this.pg;
    this._set();
  }

  /**
   * @method _createHexagon
   * @memberof Hexagon
   * @protected
   * @description
   * 六角形の座標点を作成する関数
   */
  _createHexagon() {
    const points = []; // 座標点を格納する配列,drawPolygonに渡す 1次元配列
    const num = 6;
    const angle = 360 / num;
    for (let i = 0; i < num; i++) {
      const rad = angle * i;
      const x = this.radius * Math.cos(radians(rad)) + this.center.x;
      const y = this.radius * Math.sin(radians(rad)) + this.center.y;
      points.push(x);
      points.push(y);
    }
    return points;
  }
}
