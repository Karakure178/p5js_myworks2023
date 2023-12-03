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
  let color1;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    p.frameRate(24);
    //p.rectMode(p.CENTER);
    p.noStroke();
    p.fill('#CE7777');

    pg = p.createGraphics(p.width * 2, p.height * 2);
    image_init(pg);

    theShader1 = p.createShader(shader1.vs, shader1.fs);
    //motion(frame);

    color1 = rand_color('#B6BBC4');
  };

  p.draw = () => {
    p.translate(-p.width / 2, -p.height / 2);

    p.push();
    pg.background('#F3EEEA');
    pg.push();
    pg.translate(100 * p.sin(p.radians(p.frameCount)), 0);
    grid(10, pg);
    pg.pop();

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    theShader1.setUniform('u_color1', color1);
    p.image(pg, 0, 0);
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_hatching', 'png');
      p.saveGif('p5js_hatching', 4);
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

  uniform vec3 u_color1;


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

    // ハッチング: https://www.shadertoy.com/view/Xs2XDD
    // なぜかpgを2倍で作らないと適切なサイズにならない
    float stride = 9.0;
    vec3 c = texture2D(u_tex, gl_FragCoord.xy / u_resolution.xy).rgb;
    float v = dot(c, c);
    vec2 p = gl_FragCoord.xy;
    p.x += floor(sin(p.x * 0.04) * 2.0 + sin(p.y * 0.09 + p.x * 0.07));
    p = mod(p.xx + vec2(p.y, -p.y), vec2(stride));
    
    gl_FragColor = vec4(vec3(
      float((v > 1.00) || (p.x != 0.0)) *
      float((v > 0.70) || (p.y != 0.0)) *
      float((v > 0.35) || (p.x != stride / 2.0)) *
      float((v > 0.18) || (p.y != stride / 2.0)) *
      float((v > 0.10) || (p.x != stride / 4.0)) *
      float((v > 0.02) || (p.y != stride / 4.0))), 1.0);
    // ハッチング終わり

    // white noise用
    float interval = 3.0;
    float strength = smoothstep(interval * 0.5, interval, interval - mod(u_time, interval));
    float whiteNoise = (random(uv + mod(u_time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);

    vec4 tex = texture2D(u_tex, uv);
    if(gl_FragColor.x < 1.0 && gl_FragColor.y < 1.0 && gl_FragColor.z < 1.0){
      gl_FragColor = tex + whiteNoise;
    }else{
      gl_FragColor = vec4(u_color1, 1.0);
    }
  }
`,
};
