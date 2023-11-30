import { Vector } from './utils/vector';
import { map } from './utils/map';
import { radians } from './utils/radians';

// 2つの円を行ったり来たりさせるアニメーション
// app: pixiアプリケーション
// circle1: 円を描画するためのpixi.jsのGraphicsクラス

// 円上に配置するための処理
const circle_container = [];
export const interpolatedData = []; // 線形補間用箱
export const interpolatedData_num = 20; // 線形補間の分割数
export const points_num = 50; // 配置する小さな円の個数
const r = 360 / points_num; // 小さな円を配置する角度
const r_container = [80, 150, 270]; // 配置する円の半径

export const circleVector = () => {
  for (let k = 0; k < r_container.length; k++) {
    circle_container.push([]);
    for (let i = 0; i < points_num; i++) {
      const x = r_container[k] * Math.cos(radians(r * i));
      const y = r_container[k] * Math.sin(radians(r * i));
      circle_container[k].push(new Vector(x, y));
    }
  }

  for (let n = 0; n < interpolatedData_num; n++) {
    // 線形補間を入れるために配列宣言
    interpolatedData.push(new Array(points_num).fill(new Vector(0, 0)));
    for (let i = 0; i < points_num; i++) {
      //console.log('n / interpolatedData_num:', n / interpolatedData_num);
      const lerp = new Vector(0, 0).lerp(circle_container[0][i], circle_container[2][i], n / interpolatedData_num);
      interpolatedData[n][i] = new Vector(lerp.x, lerp.y);
    }
  }
};

export const circleVectorDraw = (circle1, count) => {
  //実際に小さい円と大きい円の間をいったり来たりさせる
  circle1.clear();
  for (let n = 0; n < points_num; n++) {
    circle1.beginFill(0xffffff);
    circle1.drawCircle(interpolatedData[count][n].x, interpolatedData[count][n].y, (5 * count) / 3);
  }
};
