// p5.jsのVectorクラスをpixi.jsで使えるように再現したクラス

import { map } from './map';

export class Vector {
  constructor(x, y) {
    this.x = 0;
    this.y = 0;
    if (x && y) {
      this.x = x;
      this.y = y;
    }
  }

  // ベクトルの線形補間：https://scrapbox.io/sayachang/lerp.JavaScript
  /**
   * 2つのベクトルの間を線形補間する
   * @method lerp
   * @param  {Number}    start   x component.
   * @param  {Number}    end   y component.
   * @param  {Number}    t number between 0 and 1
   **/
  lerp(start, end, t) {
    //start,end
    if (end.x == start.x) return end;
    this.x = map(t, 0, 1, start.x, end.x);
    this.y = start.y + ((end.y - start.y) * (this.x - start.x)) / (end.x - start.x);
    return this;
  }
}
