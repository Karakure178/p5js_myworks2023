import gsap from 'gsap';

/**
 * sin rect アニメーションスケッチ
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let color0, color1;
  let theShader;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    p.frameRate(24);
    pg = p.createGraphics(p.width, p.height);
    pg.fill('#3d3d3d');
    theShader = p.createShader(shader.vs, shader.fs);
    color0 = rand_color();
    color1 = rand_color();
  };

  p.draw = () => {
    pg.background(220);
    pg.push();
    pg.circle(pg.width / 2, pg.height / 2, 400);
    pg.pop();

    p.shader(theShader);
    theShader.setUniform(`u_tex`, pg);
    theShader.setUniform(`u_time`, -p.frameCount / 35);
    theShader.setUniform(`u_color0`, color0);
    theShader.setUniform(`u_color1`, color1);
    p.image(pg, -pg.width / 2, -pg.height / 2);
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_rect-wave2', 4);
    }
  };

  /**
   * フレームの動きをアニメーション化関数
   * @param {Array} frame - フレーム情報の配列
   */
  const motion = (frame) => {
    gsap.timeline({ repeat: -1 }).to(frame, {
      count: 1,
      duration: 2,
      ease: 'quad.inOut',
    });
  };

  const rand_color = () => {
    let rc = p.color(p.random(180, 260), p.random(70, 100), p.random(90, 100));
    return [p.red(rc) / 255.0, p.green(rc) / 255.0, p.blue(rc) / 255.0];
  };
};

const shader = {
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
  uniform vec3 u_color1;

  float pi = 3.14159265358979;

  void main() {
    vec3 color = mix(u_color0, u_color1, vTexCoord.x);

    vec2 uv = vTexCoord;
    uv.x += 0.2 * cos(uv.y*pi*5.0 + u_time);
    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = vec4(color, 1.0) * tex;
  }
`,
};
