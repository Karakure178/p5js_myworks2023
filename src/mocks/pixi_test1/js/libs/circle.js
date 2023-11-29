import { Vector ,Vector.leap } from './utils/vector';
import { map } from './utils/map';
import { radians } from './utils/radians';

// 2つの円を行ったり来たりさせるアニメーション
// app: pixiアプリケーション
// circle1: 円を描画するためのpixi.jsのGraphicsクラス
export const circleVector = (app, circle1) => {
  app.stage.addChild(circle1);

  // 円上に配置するための処理
  const circle_container = [];
  const interpolatedData = []; // 線形補間用箱
  const interpolatedData_num = 20; // 線形補間の分割数
  const points_num = 10; // 配置する小さな円の個数
  const r = 360 / points_num; // 小さな円を配置する角度
  const r_container = [50, 150, 170]; // 配置する円の半径

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
    interpolatedData.push(new Array(points_num).fill(new Vector()));
    for (let i = 0; i < points_num; i++) {
      // TODO vector.lerp要修正
      const lerp = Vector.lerp(circle_container[0][i], circle_container[2][i], n / interpolatedData_num);
      interpolatedData[n][i] = new Vector(lerp.x, lerp.y);
    }
  }

  //実際に小さい円と大きい円の間をいったり来たりさせる
  const count = 0;
  for (let n = 0; n < points_num; n++) {
    circle1.beginFill(0xffffff);
    circle1.drawCircle(interpolatedData[count][n].x, interpolatedData[count][n].y, 50);
    // p.circle(,  (count + 5) * 2);
  }
};
