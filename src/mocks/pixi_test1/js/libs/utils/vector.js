// p5.jsのVectorクラスをpixi.jsで使えるように再現したクラス

import { map } from "./map";

export class Vector{
  x = 0; 
  y = 0;
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  
  // ベクトルの線形補間：https://scrapbox.io/sayachang/lerp.JavaScript
  // 2つのベクトルの間を線形補間する
  // start,end:ベクトル
  // start.x,start.y:始点の座標
  // end.x,end.y:終点の座標
  // t:補間する位置(0~1)
  lerp(start, end, t) {
    //start,end
    if(end.x == start.x) return end;
    const x = map(t, 0, 1, start.x, end.x);
    const y = start.y + (end.y - start.y) * (x - start.x) / (end.x - start.x);
    return new Vector(x, y);
  }
}
