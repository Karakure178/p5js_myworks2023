import gsap from 'gsap';

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
  let w;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);
    p.imageMode(p.CENTER);
    p.textureMode(p.NORMAL);
    p.frameRate(24);
    p.noStroke();

    w = p.width;
    pg = p.createGraphics(w / 2, w / 2);
    pg2 = p.createGraphics(w / 2, w / 2);
    image_init(pg);
    image_init(pg2);

    theShader1 = p.createShader(shader.vs, shader.fs);
    theShader2 = p.createShader(shader2.vs, shader2.fs);
    color0 = rand_color('#19A7CE');
  };

  p.draw = () => {
    p.background(110);

    p.push();
    const rect_s = 100;
    pg.push();
    pg.translate(pg.width / 2, pg.height / 2);
    pg.rect(0, 0, rect_s, rect_s);
    pg.pop(); // pg.translateを使うならpush,popを使わないと描画がおかしくなる

    p.shader(theShader1);
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_time`, -p.frameCount / 35);
    theShader1.setUniform(`u_color0`, color0);
    p.image(pg, -p.width / 4, -p.height / 4);
    p.pop();

    p.push();
    pg2.push();
    pg2.translate(pg2.width / 2, pg2.height / 2);
    pg2.rect(0, 0, rect_s, rect_s);
    pg2.pop();

    p.shader(theShader2);
    theShader2.setUniform(`u_tex`, pg2);
    theShader2.setUniform(`u_time`, -p.frameCount / 35);
    theShader2.setUniform(`u_color0`, color0);
    p.image(pg2, p.width / 4, p.height / 4);
    p.pop();

    p.push();
    p.fill(110);
    p.circle(0, 0, 100); // 上記shaderをpush,popでかこっているので上書きで描画できる
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_rect-wave2', 4);
    }
  };

  const rand_color = (colorCode) => {
    let rc = p.color(colorCode);
    return [p.red(rc) / 255.0, p.green(rc) / 255.0, p.blue(rc) / 255.0];
  };

  const image_init = (pg) => {
    pg.rectMode(p.CENTER);
    pg.background(100);
    pg.fill(255);
    pg.stroke(255);
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

  float pi = 3.14159265358979;

  void main() {
    vec3 color = u_color0;

    vec2 uv = vTexCoord;
    uv.x += 0.2 * cos(uv.y*pi*5.0 + u_time);
    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = vec4(color, 1.0) * tex;
  }
`,
};

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

  float pi = 3.14159265358979;

  void main() {
    vec3 color = u_color0;

    vec2 uv = vTexCoord;
    uv.y += 0.09 * sin(uv.x*pi*5.0 + u_time);
    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = vec4(color, 1.0) * tex;
  }
`,
};
