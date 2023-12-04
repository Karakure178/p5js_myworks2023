import p5 from 'p5';

/**
 * ポストエフェクトを活用したアニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = function (p) {
  let maxNum = 100;
  let canvas;
  let pg;
  let pg_2;

  let theShader1;
  let color0;

  // 高さで分割してずらす
  function noiseWidth(xy, random_shift) {
    const heightSplit = p.height / random_shift.length; // heightNum分分割するときの高さ
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
    constructor(r, maxR, maxNum, w, h, heightNum, randomWidth, pg) {
      this.r = r;
      this.maxR = maxR;
      this.maxNum = maxNum;
      this.w = w; // 中心点
      this.h = h; // 中心点
      this.heightNum = heightNum; // 高さの分割数
      this.random_shift = []; // 高さごとでずらす幅を代入する箱
      this.pg = pg;

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

        const maxXY_radian_width = noiseWidth(maxXY_radian, this.random_shift);
        maxPoints.push(new p5.Vector(maxXY_radian_width[0], maxXY_radian_width[1]));
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

      const maxLast = afin_translate(
        this.maxR * p.cos(p.radians(angle * num)),
        this.maxR * p.sin(p.radians(angle * num)),
        this.w,
        this.h
      );
      const maxLast_radian = afin_rotate(rotate, maxLast[0], maxLast[1], this.w, this.h);
      const maxLast_radian_width = noiseWidth(maxLast_radian, this.random_shift);
      maxPoints.push(new p5.Vector(maxLast_radian_width[0], maxLast_radian_width[1]));
      maxPoints.reverse();

      //ここから描画開始
      this.pg.beginShape();

      // 最初の点だけ描画する
      const zeroVertex = afin_rotate(
        rotate,
        afin_translate(this.maxR * p.cos(p.radians(0)), this.maxR * p.sin(p.radians(0)), this.w, this.h)[0],
        afin_translate(this.maxR * p.cos(p.radians(0)), this.maxR * p.sin(p.radians(0)), this.w, this.h)[1],
        this.w,
        this.h
      );
      const zeroVertex_width = noiseWidth(zeroVertex, this.random_shift);
      this.pg.vertex(zeroVertex_width[0], zeroVertex_width[1]);

      for (let i = 0; i < (num + 1) * 2; i++) {
        if (i > num + 1 - 1) {
          this.pg.vertex(maxPoints[i - (num + 1)].x, maxPoints[i - (num + 1)].y);
        } else {
          this.pg.vertex(points[i].x, points[i].y);
        }
      }
      this.pg.endShape();
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
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.translate(p.width / 2, p.height / 2);
    p.strokeWeight(3);

    pg = p.createGraphics(p.width, p.height);
    image_init(pg);

    pg_2 = p.createGraphics(p.width, p.height);
    image_init(pg_2);
    theShader1 = p.createShader(shader1.vs, shader1.fs);

    color0 = rand_color('#F3EEEA');
  };

  let count = 0;
  p.draw = function () {
    p.translate(-p.width / 2, -p.height / 2);
    p.background(220);

    const circles = () => {
      p.push();
      pg.push();
      pg.clear();
      pg.background(220); // 透明にしたい場合はコメントアウト
      const colorCode = ['#776B5D', '#994D1C', '#DED0B6', '#FDF7E4'];

      pg.fill(colorCode[0]);
      let s_load = new Loading(140, 150, 100, p.width / 2, p.height / 2, 10, 2, pg);
      s_load.loading(count, p.radians(0));

      pg.fill(colorCode[3]);
      let s_load2 = new Loading(20, 80, 100, p.width / 2, p.height / 2, 10, 2, pg);
      s_load2.loading(count, p.radians(15));

      pg.fill(colorCode[0]);

      let s_load3 = new Loading(50, 70, 100, p.width / 2, p.height / 2, 10, 2, pg);
      s_load3.loading(50, p.radians(count));

      pg.fill(colorCode[0]);
      let s_load4 = new Loading(100, 130, 100, p.width / 2, p.height / 2, 10, 2, pg);
      s_load4.loading(count, p.radians(150));

      pg.fill(colorCode[2]);
      let s_load5 = new Loading(90, 200, 100, p.width / 2, p.height / 2, 10, 2, pg);
      s_load5.loading(15, p.radians(count + 120));
      s_load5.loading(15, p.radians(count + 240));
      s_load5.loading(15, p.radians(count + 0));

      pg.fill(colorCode[1]);
      let s_load6 = new Loading(100, 170, 100, p.width / 2, p.height / 2, 10, 2, pg);
      s_load6.loading(10, p.radians(count + 190));
      s_load6.loading(10, p.radians(count + 70));
      s_load6.loading(10, p.radians(count + 310));

      p.shader(theShader1);
      theShader1.setUniform(`u_tex`, pg);
      theShader1.setUniform(`u_time`, -p.frameCount / 35);
      theShader1.setUniform('u_resolution', [pg.width, pg.height]);
      theShader1.setUniform('u_color', color0);
      pg.pop();
      p.image(pg, 0, 0);
      p.pop();
    };

    const cirlces2 = () => {
      p.push();
      pg_2.push();
      pg_2.clear();
      pg_2.noFill();
      pg_2.strokeWeight(3);
      pg_2.stroke('#191919');
      let load = new Loading(140, 150, 100, p.width / 2, p.height / 2, 10, 2, pg_2);
      load.loading(count, p.radians(0));

      let load2 = new Loading(20, 80, 100, p.width / 2, p.height / 2, 10, 2, pg_2);
      load2.loading(count, p.radians(15));

      let load3 = new Loading(50, 70, 100, p.width / 2, p.height / 2, 10, 2, pg_2);
      load3.loading(50, p.radians(count));

      let load4 = new Loading(100, 130, 100, p.width / 2, p.height / 2, 10, 2, pg_2);
      load4.loading(count, p.radians(150));

      let load5 = new Loading(90, 200, 100, p.width / 2, p.height / 2, 10, 2, pg_2);
      load5.loading(15, p.radians(count + 120));
      load5.loading(15, p.radians(count + 240));
      load5.loading(15, p.radians(count + 0));

      let load6 = new Loading(100, 170, 100, p.width / 2, p.height / 2, 10, 2, pg_2);
      load6.loading(10, p.radians(count + 190));
      load6.loading(10, p.radians(count + 70));
      load6.loading(10, p.radians(count + 310));
      pg_2.pop();

      p.image(pg_2, 0, 0);
      p.pop();
    };

    circles();
    cirlces2();
    if (count < maxNum) {
      count++;
    } else {
      count = 0;
    }
  };

  p.keyPressed = function () {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'myCanvas', 'png');
      p.saveGif('p5js_circles-noise', 4);
    }
  };

  // createGraphicsの初期設定
  const image_init = (pg) => {
    pg.noStroke();
    pg.fill('#776B5D');
  };

  const rand_color = (colorCode) => {
    let rc = p.color(colorCode);
    return [p.red(rc) / 255.0, p.green(rc) / 255.0, p.blue(rc) / 255.0];
  };
};

const shader1 = {
  vs: `
  precision highp float;
  precision highp int;

  attribute vec3 aPosition;
  attribute vec2 aTexCoord;

  varying vec2 vTexCoord;

  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;

  void main() {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vTexCoord = aTexCoord;

  }
`,
  fs: `
  precision highp float;
  precision highp int;

  varying vec2 vTexCoord;

  uniform sampler2D u_tex;
  uniform float u_time;
  uniform vec2 u_resolution;

  uniform vec3 u_color;

  float PI = 3.14159265358979;

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  // iosだと動かない可能性がある:https://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
  float random(vec2 c){
    return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 uv = vTexCoord;

    // ハッチング: https://github.com/pixijs/filters/blob/main/filters/cross-hatch/src/crosshatch.frag
    float hatch = 8.0;// ハッチングのサイズを変えられる
    float lum = length(texture2D(u_tex, uv.xy).rgb);

    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    bool isHatch = false;

    if (lum < 1.00){
      if (mod(gl_FragCoord.x + gl_FragCoord.y, hatch) == 0.0){
        gl_FragColor = tex;
        isHatch = true;
      }
    }

    if (lum < 0.75){
      if (mod(gl_FragCoord.x - gl_FragCoord.y, hatch) == 0.0){
          gl_FragColor = tex;
          isHatch = true;
      }
    }

    if (lum < 0.50){
      if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, hatch) == 0.0){
          gl_FragColor = tex;
          isHatch = true;
      }
    }

    if (lum < 0.3){
      if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, hatch) == 0.0){
          gl_FragColor = tex;
          isHatch = true;
      }
    }

    if(isHatch == false){
      gl_FragColor = vec4(u_color, 1.0);
    }


    // white noise用
    float interval = 3.0;
    float strength = smoothstep(interval * 0.5, interval, interval - mod(u_time, interval));
    float whiteNoise = (random(uv + mod(u_time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);

   //gl_FragColor = tex ; //+ whiteNoise;    
  }
`,
};
