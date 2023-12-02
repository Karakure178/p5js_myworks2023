/**
 * sin rect アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let theShader1;

  const easing = {
    easeInQuad: (t) => t * t,
  };

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    p.frameRate(24);
    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill('#CE7777');

    pg = p.createGraphics(p.width, p.height);
    // pg.stroke(10);
    image_init(pg);

    theShader1 = p.createShader(shader1.vs, shader1.fs);
  };

  p.draw = () => {
    p.background('#2B3A55');
    p.translate(-p.width / 2, -p.height / 2);

    pg.push();
    pg.translate(p.width / 2, p.height / 2);
    //star(0, 0, 80, 160, 5, pg);
    pg.rotate(p.radians(30));
    for (let i = 0; i < 5; i++) {
      let x = p.cos(p.radians(72 * i)) * 280;
      let y = p.sin(p.radians(72 * i)) * 280;
      star(x, y, 30, 40, 5, pg);

      x = p.cos(p.radians(72 * i)) * 200;
      y = p.sin(p.radians(72 * i)) * 200;
      star(x, y, 30, 40, 5, pg);

      // x = p.cos(p.radians(72 * i)) * 150;
      // y = p.sin(p.radians(72 * i)) * 150;
      // star(x, y, 20, 27, 5, pg);

      x = p.cos(p.radians(72 * i)) * 100;
      y = p.sin(p.radians(72 * i)) * 100;
      star(x, y, 30, 20, 5, pg);

      x = p.cos(p.radians(72 * i)) * 50;
      y = p.sin(p.radians(72 * i)) * 50;
      star(x, y, 15, 10, 5, pg);
    }
    pg.pop();

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    theShader1.setUniform(`u_isSin`, false); // 条件出し分け用
    theShader1.setUniform('u_resolution', [pg.width, pg.height]);
    p.image(pg, 0, 0);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_star', 'png');
      //p.saveGif('p5js_rect-wave2', 4);
    }
  };

  // createGraphicsの初期設定
  const image_init = (pg) => {
    pg.rectMode(p.CENTER);
    //pg.background(220);// 透明にしたい場合はコメントアウト
    pg.noStroke();
    pg.fill('#CE7777');
  };

  /**
   * 指定された座標に、指定された半径と頂点数で星形を描画します。
   *
   * @param {number} x - 星形の中心の x 座標。
   * @param {number} y - 星形の中心の y 座標。
   * @param {number} radius1 - 星形の外側の頂点の半径。
   * @param {number} radius2 - 星形の内側の頂点の半径。
   * @param {number} npoints - 星形の頂点数。
   * @param {p5.Graphics} pg - 描画先のグラフィックス。
   */
  function star(x, y, radius1, radius2, npoints, pg) {
    let angle = p.TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    pg.beginShape();
    for (let a = 0; a < p.TWO_PI; a += angle) {
      let sx = x + p.cos(a) * radius2;
      let sy = y + p.sin(a) * radius2;
      pg.vertex(sx, sy);
      sx = x + p.cos(a + halfAngle) * radius1;
      sy = y + p.sin(a + halfAngle) * radius1;
      pg.vertex(sx, sy);
    }
    pg.endShape(p.CLOSE);
  }
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
  uniform bool u_isSin;

  float PI = 3.14159265358979;
  float interval = 3.0;
  float aperture = 178.0; // 魚眼レンズ用


  float random(vec2 c){
    return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 uv = vTexCoord;

    // 魚眼レンズ用 : https://www.geeks3d.com/20140213/glsl-shader-library-fish-eye-and-dome-and-barrel-distortion-post-processing-filters/
    float apertureHalf = 0.5 * aperture * (PI / 180.0);
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
