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
  let color0;

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
    //motion(frame);

    color0 = rand_color('#F3EEEA');
  };

  p.draw = () => {
    p.translate(-p.width / 2, -p.height / 2);

    p.push();
    pg.background('#F3EEEA');
    pg.push();
    grid(4, pg);
    pg.fill('#191919');
    pg.translate(10, 0);
    grid(4, pg);
    pg.pop();

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    theShader1.setUniform('u_color', color0);
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
