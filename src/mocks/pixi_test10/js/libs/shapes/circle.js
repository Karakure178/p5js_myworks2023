import Shape from './core/shape';
/**
 * @class Circle
 * @description
 * 円を描くクラス<br>
 * Shapeクラスを継承している
 */
class Circle extends Shape {
  /**
   * @constructor
   * @param {PIXI.Application} app - アプリケーション
   * @param {Number} vertexes - 頂点数
   * @param {Number} radius - 半径
   * @param {Number} color - 色
   */
  constructor(app, vertexes, radius, color) {
    super(app);
    this.vertexes = vertexes;
    this.radius = radius;
    this.color = color;
  }
}
