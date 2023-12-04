import gsap from 'gsap';
import p5 from 'p5';

/**
 * アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let theShader1;
  const frame = { count: 0 };
  const frame2 = { count: 0 };
  const frame3 = { count: 0 };
  const frame4 = { count: 0 };
  const frame5 = { count: 0 };
  const frame6 = { count: 0 };
  const frame7 = { count: 0 };

  let color0;

  // 高さで分割してずらす
  const noiseWidth = (xy, random_shift) => {
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
  };

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
        this.r * Math.cos(p.radians(angle * num)),
        this.r * Math.sin(p.radians(angle * num)),
        this.w,
        this.h
      );
      const pointsLast_radian = afin_rotate(rotate, pointsLast[0], pointsLast[1], this.w, this.h);

      const pointsLast_radian_width = noiseWidth(pointsLast_radian, this.random_shift);
      points.push(new p5.Vector(pointsLast_radian_width[0], pointsLast_radian_width[1]));

      const maxLast = afin_translate(
        this.maxR * Math.cos(p.radians(angle * num)),
        this.maxR * Math.sin(p.radians(angle * num)),
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
        afin_translate(this.maxR * Math.cos(p.radians(0)), this.maxR * Math.sin(p.radians(0)), this.w, this.h)[0],
        afin_translate(this.maxR * Math.cos(p.radians(0)), this.maxR * Math.sin(p.radians(0)), this.w, this.h)[1],
        this.w,
        this.h
      );
      const zeroVertex_width = noiseWidth(zeroVertex, this.random_shift);
      this.pg.vertex(zeroVertex_width[0], zeroVertex_width[1]);

      for (let i = 0; i < (num + 1) * 2; i++) {
        if (i > num + 1 - 1) {
          console.log(this.pg.vertex(0, 0));
          this.pg.vertex(maxPoints[i - (num + 1)].x, maxPoints[i - (num + 1)].y);
        } else {
          this.pg.vertex(points[i].x, points[i].y);
        }
      }
      this.pg.endShape();
    }
  }

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.noStroke();
    p.fill('#CE7777');

    pg = p.createGraphics(p.width, p.height);
    image_init(pg);

    //theShader1 = p.createShader(shader1.vs, shader1.fs);
    motion(frame);
    motion(frame2);
    motion(frame3);
    motion(frame4);
    motion(frame5);
    motion(frame6);
    motion(frame7);

    color0 = rand_color('#F3EEEA');
  };

  p.draw = () => {
    //p.translate(-p.width / 2, -p.height / 2);

    p.push();
    pg.background('#F3EEEA');
    pg.push();

    let load = new Loading(140, 150, 100, pg.width / 2, pg.height / 2, 10, 2, pg);
    load.loading(parseInt(frame.count), p.radians(0));

    // let load2 = new Loading(20, 80, 100, p.width / 2, p.height / 2, 10, 2, pg);
    // load2.loading(parseInt(frame2.count), p.radians(15));

    // let load3 = new Loading(50, 70, 100, p.width / 2, p.height / 2, 10, 2, pg);
    // load3.loading(50, p.radians(parseInt(frame.count)));

    // let load4 = new Loading(100, 130, 100, p.width / 2, p.height / 2, 10, 2, pg);
    // load4.loading(parseInt(frame.count), p.radians(150));

    // let load5 = new Loading(90, 200, 100, p.width / 2, p.height / 2, 10, 2, pg);
    // load5.loading(15, p.radians(parseInt(frame.count) + 120));
    // load5.loading(15, p.radians(parseInt(frame.count) + 240));
    // load5.loading(15, p.radians(parseInt(frame.count) + 0));

    // let load6 = new Loading(100, 170, 100, p.width / 2, p.height / 2, 10, 2, pg);

    // load6.loading(10, p.radians(parseInt(frame4.count) + 190));
    // load6.loading(10, p.radians(parseInt(frame4.count) + 70));
    // load6.loading(10, p.radians(parseInt(frame4.count) + 310));
    pg.fill('#191919');
    pg.translate(10, 0);
    pg.pop();

    // p.shader(theShader1);
    // theShader1.setUniform(`u_tex`, pg);
    // theShader1.setUniform(`u_time`, -p.frameCount / 35);
    // theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    // theShader1.setUniform('u_color', color0);
    p.image(pg, 0, 0);
    p.pop();

    p.push();
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_fisheye', 'png');
      p.saveGif('p5js_fisheye', 4);
    }
  };

  // createGraphicsの初期設定
  const image_init = (pg) => {
    //pg.rectMode(p.CENTER);
    //pg.background(220);// 透明にしたい場合はコメントアウト
    //pg.noStroke();
    pg.noFill();

    //pg.fill('#776B5D');
  };

  /** num個で分割したグリッドを画面いっぱいに生成する
   * @method grid
   * @param  {Number}        num           画面の分割数
   */
  const grid = (num, pg) => {
    const n1 = num + 1;

    const margin_left = pg.width / n1 / n1;
    const margin_bottom = pg.height / n1 / n1;

    const nw = pg.width / n1;
    const nh = pg.height / n1;

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        pg.circle(x + nw / 2, y + nw / 2, nw);
      }
    }
  };

  const rand_color = (colorCode) => {
    let rc = p.color(colorCode);
    return [p.red(rc) / 255.0, p.green(rc) / 255.0, p.blue(rc) / 255.0];
  };
};

/**
 * フレームの動きをアニメーション化します。
 * @param {Array} frame - フレーム情報の配列
 */
const motion = (frame) => {
  gsap
    .timeline({ repeat: -1 })
    .to(frame, {
      count: 99,
      duration: 2,
      ease: 'expo.inOut',
    })
    .to(frame, {
      count: 0,
      duration: 2,
      ease: 'expo.inOut',
    });
};

// white noise参考：https://codepen.io/ykob/pen/GmEzoQ?editors=1010
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
    float hatch = 20.0;// ハッチングのサイズを変えられる
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

//行列計算
const afin = (a, b) => {
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
};

//平行移動
const afin_translate = (x, y, tx, ty) => {
  let a = [
    [1, 0, tx],
    [0, 1, ty],
    [0, 0, 1],
  ];
  let b = [x, y, 1];
  return afin(a, b);
};

//回転
const afin_rotate = (shita, x, y, tx, ty) => {
  let a = [
    [Math.cos(shita), -Math.sin(shita), tx - tx * Math.cos(shita) + ty * Math.sin(shita)],
    [Math.sin(shita), Math.cos(shita), ty - tx * Math.sin(shita) - ty * Math.cos(shita)],
    [0, 0, 1],
  ];
  let b = [x, y, 1];
  return afin(a, b);
};
