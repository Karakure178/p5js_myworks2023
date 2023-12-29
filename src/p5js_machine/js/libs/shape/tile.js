export class Tile {
  // x,y = 中心座標
  // w,h = 幅と高さ
  // p = p5インスタンス
  constructor(p, x, y, w, h) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rand = Math.round(p.random(0, 5));
  }

  randRect() {
    this.p.push();
    this.p.translate(this.x, this.y);
    const x = -this.w / 2 + this.w / 8;
    const y = -this.h / 2 + this.h / 8;
    const ex = this.w / 2 - this.w / 8;
    const ey = this.h / 2 - this.h / 8;

    if (this.rand === 0) {
      this.p.rect(0, 0, this.w / 2, this.h / 2);
    } else if (this.rand === 1) {
      this.p.rect(x, y, this.w / 4, this.h / 4);
      this.p.rect(ex, ey, this.w / 4, this.h / 4);
    } else if (this.rand === 2) {
      this.p.rotate(this.p.PI / 2);
      this.p.rect(x, y, this.w / 4, this.h / 4);
      this.p.rect(ex, ey, this.w / 4, this.h / 4);
    } else if (this.rand === 3) {
      this.p.circle(this.w / 2, this.h / 2, this.w / 2);
    } else if (this.rand === 4) {
      this.p.circle(0, 0, this.w / 2);
    } else {
      this.p.rect(x, y, this.w / 4, this.h / 4);
      this.p.rect(ex, ey, this.w / 4, this.h / 4);
      this.p.scale(1, -1);
      this.p.rect(x, y, this.w / 4, this.h / 4);
      this.p.rect(ex, ey, this.w / 4, this.h / 4);
    }
    this.p.pop();
  }
}
