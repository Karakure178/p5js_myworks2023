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
  let pg_blur;

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

  /** num個で分割したグリッドを画面いっぱいに生成する
   * @method grid
   * @param  {Number}        num           画面の分割数
   */
  const grid = (num, pg) => {
    pg.rectMode(p.CENTER);
    const n1 = num + 1;
    const margin_left = pg.width / n1 / n1;
    const margin_bottom = pg.height / n1 / n1;

    const nw = pg.width / n1;
    const nh = pg.height / n1;

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        pg.rect(x + nw / 2, y + nw / 2, nw, nw, 20);
      }
    }
  };

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

    pg_blur = p.createGraphics(p.width, p.height);
    image_init(pg_blur);

    theShader1 = p.createShader(shader1.vs, shader1.fs);

    color0 = rand_color('#F3EEEA');
  };

  let count = 0;
  p.draw = function () {
    p.translate(-p.width / 2, -p.height / 2);
    p.background(220);

    // https://note.com/aq_kani/n/n71097945a01c
    const pct = (pg) => {
      pg.push();
      pg.background(0);
      pg.noStroke();

      let NUM = 10;
      let diameter = 800;
      for (let i = NUM; i > 0; i--) {
        let pct = i / NUM; // 0 ~ 1 のパーセンテージ
        let d = pct * diameter; // pct から算出
        pg.fill(pct * 255); // pct から算出
        pg.circle(pg.width / 2, pg.height / 2, d);
      }
      pg.pop();
    };

    p.push();
    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    grid(6, pg);
    p.image(pg, 0, 0);
    p.pop();

    p.push();
    pg_blur.push();
    pct(pg_blur);
    p.tint(255, 100); // https://www.fabiofranchino.com/log/how-to-change-the-opacity-of-an-image-in-p5-js/
    p.image(pg_blur, 0, 0);
    pg_blur.pop();
    p.pop();

    if (count < maxNum) {
      count++;
    } else {
      count = 0;
    }
  };

  p.keyPressed = function () {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'myCanvas', 'png');
      //p.saveGif('p5js_circles-noise', 4);
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
    float hatch = 3.0;// ハッチングのサイズを変えられる
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
