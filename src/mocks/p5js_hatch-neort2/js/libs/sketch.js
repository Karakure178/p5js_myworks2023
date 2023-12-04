import p5 from 'p5';

export const sketch = function (p) {
  let maxNum = 100;
  let canvas;

  // 高さで分割してずらす
  function noiseWidth(xy, random_shift) {
    const heightSplit = p.height / random_shift.length; // heightNum分分割するときの高さ
    console.log(heightSplit);
    for (let i = 0; i < random_shift.length; i++) {
      if (xy[1] < heightSplit * i && heightSplit * (i - 1) < xy[1]) {
        xy[0] += random_shift[i];
      } else if (i === 0 && xy[1] < heightSplit * i) {
        xy[1] += random_shift[i];
      }
    }
    return xy;
  }

  class Loading {
    constructor(r, maxR, maxNum, w, h, heightNum, randomWidth) {
      this.r = r;
      this.maxR = maxR;
      this.maxNum = maxNum;
      this.w = w; // 中心点
      this.h = h; // 中心点
      this.heightNum = heightNum; // 高さの分割数
      this.random_shift = []; // 高さごとでずらす幅を代入する箱

      // 分割する高さ分、高さごとでずらす幅を代入する
      for (let i = 0; i < this.heightNum; i++) {
        this.random_shift.push(p.random(-randomWidth, randomWidth));
      }
    }

    loading(num, rotate) {
      let points = [];
      let maxPoints = [];
      let angle = 360 / this.maxNum; // 要固定
      for (let i = 0; i < num; i++) {
        const xy = afin_translate(
          this.r * p.cos(p.radians(angle * i)),
          this.r * p.sin(p.radians(angle * i)),
          this.w,
          this.h
        );
        const xy_radian = afin_rotate(rotate, xy[0], xy[1], this.w, this.h);

        const maxXY = afin_translate(
          this.maxR * p.cos(p.radians(angle * i)),
          this.maxR * p.sin(p.radians(angle * i)),
          this.w,
          this.h
        );
        const maxXY_radian = afin_rotate(rotate, maxXY[0], maxXY[1], this.w, this.h);

        const xy_radian_width = noiseWidth(xy_radian, this.random_shift);
        points.push(new p5.Vector(xy_radian_width[0], xy_radian_width[1]));
        //points.push(new p5.Vector(xy_radian[0], xy_radian[1]));

        const maxXY_radian_width = noiseWidth(maxXY_radian, this.random_shift);
        maxPoints.push(new p5.Vector(maxXY_radian_width[0], maxXY_radian_width[1]));
        //maxPoints.push(new p5.Vector(maxXY_radian[0], maxXY_radian[1]));
      }

      const pointsLast = afin_translate(
        this.r * p.cos(p.radians(angle * num)),
        this.r * p.sin(p.radians(angle * num)),
        this.w,
        this.h
      );
      const pointsLast_radian = afin_rotate(rotate, pointsLast[0], pointsLast[1], this.w, this.h);

      const pointsLast_radian_width = noiseWidth(pointsLast_radian, this.random_shift);
      points.push(new p5.Vector(pointsLast_radian_width[0], pointsLast_radian_width[1]));
      //points.push(new p5.Vector(pointsLast_radian[0], pointsLast_radian[1]));

      const maxLast = afin_translate(
        this.maxR * p.cos(p.radians(angle * num)),
        this.maxR * p.sin(p.radians(angle * num)),
        this.w,
        this.h
      );
      const maxLast_radian = afin_rotate(rotate, maxLast[0], maxLast[1], this.w, this.h);
      const maxLast_radian_width = noiseWidth(maxLast_radian, this.random_shift);
      maxPoints.push(new p5.Vector(maxLast_radian_width[0], maxLast_radian_width[1]));
      //maxPoints.push(new p5.Vector(maxLast_radian[0], maxLast_radian[1]));
      maxPoints.reverse();

      //ここから描画開始
      p.beginShape();

      // 最初の点だけ描画する
      // TODO 配列化できない？
      const zeroVertex = afin_rotate(
        rotate,
        afin_translate(this.maxR * p.cos(p.radians(0)), this.maxR * p.sin(p.radians(0)), this.w, this.h)[0],
        afin_translate(this.maxR * p.cos(p.radians(0)), this.maxR * p.sin(p.radians(0)), this.w, this.h)[1],
        this.w,
        this.h
      );
      // TODO ノイズ処理の追加
      const zeroVertex_width = noiseWidth(zeroVertex, this.random_shift);
      p.vertex(zeroVertex_width[0], zeroVertex_width[1]);
      // p.vertex(zeroVertex[0], zeroVertex[1]);

      for (let i = 0; i < (num + 1) * 2; i++) {
        if (i > num + 1 - 1) {
          p.vertex(maxPoints[i - (num + 1)].x, maxPoints[i - (num + 1)].y);
        } else {
          p.vertex(points[i].x, points[i].y);
        }
      }
      p.endShape();
    }
  }

  //行列計算
  function afin(a, b) {
    let x;
    let y;
    for (let k = 0; k < 3; k++) {
      let a0 = a[k][0] * b[0];
      let a1 = a[k][1] * b[1];
      let a2 = a[k][2] * b[2];
      if (k == 0) {
        x = a0 + a1 + a2;
      } else if (k == 1) {
        y = a0 + a1 + a2;
      }
    }
    return [x, y];
  }

  //平行移動
  function afin_translate(x, y, tx, ty) {
    let a = [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ];
    let b = [x, y, 1];
    return afin(a, b);
  }

  //回転
  function afin_rotate(shita, x, y, tx, ty) {
    let a = [
      [p.cos(shita), -p.sin(shita), tx - tx * p.cos(shita) + ty * p.sin(shita)],
      [p.sin(shita), p.cos(shita), ty - tx * p.sin(shita) - ty * p.cos(shita)],
      [0, 0, 1],
    ];
    let b = [x, y, 1];
    return afin(a, b);
  }

  p.setup = function () {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.translate(p.width / 2, p.height / 2);
    p.strokeWeight(3);
  };

  let count = 0;
  p.draw = function () {
    p.background(220);
    p.noFill();
    // lil-guiで数値管理したいね
    let load = new Loading(140, 150, 100, p.width / 2, p.height / 2, 10, 2);
    load.loading(count, p.radians(0));

    let load2 = new Loading(20, 80, 100, p.width / 2, p.height / 2, 10, 2);
    load2.loading(count, p.radians(15));

    let load3 = new Loading(50, 70, 100, p.width / 2, p.height / 2, 10, 2);
    load3.loading(50, p.radians(count));

    let load4 = new Loading(100, 130, 100, p.width / 2, p.height / 2, 10, 2);
    load4.loading(count, p.radians(150));

    let load5 = new Loading(90, 200, 100, p.width / 2, p.height / 2, 10, 2);
    load5.loading(15, p.radians(count + 120));
    load5.loading(15, p.radians(count + 240));
    load5.loading(15, p.radians(count + 0));

    let load6 = new Loading(100, 170, 100, p.width / 2, p.height / 2, 10, 2);

    load6.loading(10, p.radians(count + 190));
    load6.loading(10, p.radians(count + 70));
    load6.loading(10, p.radians(count + 310));

    //
    if (count < maxNum) {
      count++;
    } else {
      count = 0;
    }
    //
  };

  p.keyPressed = function () {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'myCanvas', 'png');
      p.saveGif('p5js_circles-noise', 4);
    }
  };
};
