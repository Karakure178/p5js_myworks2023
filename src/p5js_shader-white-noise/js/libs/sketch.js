/**
 * shaderお試し アニメーションスケッチ
 * 参考 https://gin-graphic.hatenablog.com/entry/2021/02/11/113000
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg, pg2;
  let color0;
  let theShader1, theShader2;

  let pg_circle;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    p.imageMode(p.CENTER);
    p.textureMode(p.NORMAL);
    p.frameRate(24);
    p.noStroke();

    pg = p.createGraphics(p.width, p.height);
    image_init(pg);

    pg2 = p.createGraphics(p.width, p.height);
    image_init(pg2);

    theShader1 = p.createShader(shader2.vs, shader2.fs);
    theShader2 = p.createShader(shader2.vs, shader2.fs);
    color0 = rand_color('#19A7CE');

    pg_circle = p.createGraphics(p.width, p.height);
    image_init(pg_circle);
    pg_circle.background('#191825');
  };

  p.draw = () => {
    p.background(110);

    // 一個目のグリッド
    // 普通に描画してシェーダーかけてる
    p.push();
    pg2.push();
    grid(12, pg2, false);
    pg2.pop();

    p.shader(theShader2);
    theShader2.setUniform(`u_tex`, pg2);
    theShader2.setUniform(`u_time`, -p.frameCount / 35);
    theShader2.setUniform(`u_color0`, color0);
    theShader2.setUniform(`u_isSin`, true); // 条件出し分け用
    theShader2.setUniform('u_resolution', [pg2.width, pg2.height]);
    p.image(pg2, 0, 0);
    p.pop();

    // 二個目のグリッド
    // くり抜いてシェーダーかけてる
    p.push();
    pg.push();
    grid(12, pg, true);
    pg.pop();

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    theShader1.setUniform(`u_color0`, color0);
    theShader1.setUniform(`u_isSin`, false); // 条件出し分け用
    theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    p.image(pg, 0, 0);
    p.pop();

    // いつものくり抜き円
    pg_circle.push();
    pg_circle.erase();
    pg_circle.circle(pg_circle.width / 2, pg_circle.height / 2, 400);
    pg_circle.noErase();
    pg_circle.pop();
    p.image(pg_circle, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      //p.saveCanvas(canvas, 'p5js_shader-white-noise', 'png');
      p.saveGif('p5js_shader-white-noise', 4);
    }
  };

  // colorCodeをシェーダーに渡すために0~1の値に変換
  const rand_color = (colorCode) => {
    let rc = p.color(colorCode);
    return [p.red(rc) / 255.0, p.green(rc) / 255.0, p.blue(rc) / 255.0];
  };

  // createGraphicsの初期設定
  const image_init = (pg) => {
    pg.rectMode(p.CENTER);
    pg.background(220);
    pg.noStroke();
  };

  /** num個で分割したグリッドを画面いっぱいに生成する
   * @method grid
   * @param  {Number}        num           画面の分割数
   * @param  {p5.Graphics}  pg            描画先のグラフィックス
   * @param  {Boolean}       isErase       グリッドの中を消すかどうか
   */
  function grid(num, pg, isErase) {
    const n1 = num + 1;
    const width = p.width * 2;
    const height = p.height * 2;

    const margin_left = width / n1 / n1;
    const margin_bottom = height / n1 / n1;
    const nw = width / n1;
    const nh = height / n1;
    pg.push();
    pg.translate(-nw / 2, 0);
    if (isErase) pg.erase();
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        if (j % 2 === 0) {
          pg.fill('#B31312');
          const r = nw;
          const round = 10;
          pg.rect(x + nw / 2, y + nh / 2, r, r, round, round, round, round);
        } else {
          pg.fill('#EA906C');
          const r = nw;
          const round = 20;
          pg.rect(x + nw, y + nh / 2, r, r, round, round, round, round);
        }
      }
    }
    if (isErase) pg.noErase();
    pg.pop();
  }
};

// white noise参考：https://codepen.io/ykob/pen/GmEzoQ?editors=1010
const shader2 = {
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
  uniform vec3 u_color0;
  uniform vec2 u_resolution;
  uniform bool u_isSin;

  float pi = 3.14159265358979;
  float interval = 3.0;

  float random(vec2 c){
    return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec3 color = u_color0;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 uv = vTexCoord;
    
    // if文を使わず三項演算子で条件分岐できる
    uv.y = (u_isSin) ? 0.09 * sin(uv.x*pi*5.0 + u_time) + uv.y : uv.y;
    uv.x = (!u_isSin) ? 0.09 * cos(uv.y*pi*5.0 + u_time) + uv.x : uv.x;


    // white noise用
    float strength = smoothstep(interval * 0.5, interval, interval - mod(u_time, interval));
    float whiteNoise = (random(uv + mod(u_time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);

    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = tex + whiteNoise;
  }
`,
};
