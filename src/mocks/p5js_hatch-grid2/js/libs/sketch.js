/**
 * アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let img;
  let theShader1;

  p.preload = () => {
    const filepath = '/mocks/p5js_hatch-grid2/images/p5js_fisheye.png';
    //const filepath = '/mocks/p5js_hatch-grid2/images/test.png';
    img = p.loadImage(filepath); //画像の読み込み
  };

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.noStroke();
    p.fill('#CE7777');
    theShader1 = p.createShader(shader1.vs, shader1.fs);
  };

  p.draw = () => {
    p.background('#F3EEEA');
    p.translate(-p.width / 2, -p.height / 2);

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, img);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    theShader1.setUniform('u_resolution', [img.width, img.height]);
    p.image(img, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_fisheye', 'png');
      p.saveGif('p5js_fisheye', 4);
    }
  };
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

  float PI = 3.14159265358979;

  const float frequency = 7.0;

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
    // なぜか反転する...
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

    //vec4 tex = texture2D(u_tex, uv);
    //gl_FragColor = tex + whiteNoise;    
  }
`,
};
