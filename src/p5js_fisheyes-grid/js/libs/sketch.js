import gsap from 'gsap';

/**
 * アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let theShader1;
  const frame = { count: 0 };

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    p.frameRate(24);
    //p.rectMode(p.CENTER);
    p.noStroke();
    p.fill('#CE7777');

    pg = p.createGraphics(p.width, p.height);
    image_init(pg);

    theShader1 = p.createShader(shader1.vs, shader1.fs);
    motion(frame);
  };

  p.draw = () => {
    p.background('#F3EEEA');
    p.translate(-p.width / 2, -p.height / 2);

    pg.push();
    //pg.translate(p.width / 2, p.height / 2);
    grid(10, pg);
    pg.pop();

    const aperture = p.map(frame.count, 0, 1, 180, 90);

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    theShader1.setUniform(`u_aperture`, aperture);
    theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    p.image(pg, 0, 0);
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
    pg.noStroke();
    pg.fill('#776B5D');
  };

  /** num個で分割したグリッドを画面いっぱいに生成する
   * @method grid
   * @param  {Number}        num           画面の分割数
   */
  const grid = (num, pg) => {
    const n1 = num + 1;

    const margin_left = p.width / n1 / n1;
    const margin_bottom = p.height / n1 / n1;

    const nw = p.width / n1;
    const nh = p.height / n1;

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        pg.circle(x + nw / 2, y + nw / 2, nw);
      }
    }
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
      count: 1,
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
  uniform float u_aperture;

  float PI = 3.14159265358979;
  float interval = 3.0;


  float random(vec2 c){
    return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 uv = vTexCoord;

    // 魚眼レンズ用 : https://www.geeks3d.com/20140213/glsl-shader-library-fish-eye-and-dome-and-barrel-distortion-post-processing-filters/
    float apertureHalf = 0.5 * u_aperture * (PI / 180.0);
    float maxFactor = sin(apertureHalf);

    vec2 xy = 2.0 * uv.xy - 1.0;
    float d = length(xy);

    if (d < (2.0-maxFactor)){
      d = length(xy * maxFactor);
      float z = sqrt(1.0 - d * d);
      float r = atan(d, z) / PI;
      float phi = atan(xy.y, xy.x);
      
      uv.x = r * cos(phi) + 0.5;
      uv.y = r * sin(phi) + 0.5;
    }

    // white noise用
    float strength = smoothstep(interval * 0.5, interval, interval - mod(u_time, interval));
    float whiteNoise = (random(uv + mod(u_time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);

    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = tex + whiteNoise;
    // gl_FragColor: tex*0.1のようにかけると全体的に色が薄くなる、結果として下が透ける
  }
`,
};
