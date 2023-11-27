/**
 * gridちょっとずらすスケッチ
 * 参考：https://gin-graphic.hatenablog.com/entry/2021/02/11/113000
 * @param {p5} p - The p5.js instance.
 */
export const sketch = (p) => {
  let canvas;
  let pg;
  let pg_tile;

  let theShader;
  let color_pg;

  p.setup = () => {
    const canvasid = document.getElementById('mycanvas');
    canvas = p.createCanvas(canvasid.clientWidth, canvasid.clientHeight, p.WEBGL);
    canvas.parent(canvasid);

    p.frameRate(24);
    pg = p.createGraphics(p.width, p.height);
    pg_tile = p.createGraphics(p.width, p.height);
    pg_tile.rectMode(p.CENTER);
    pg_tile.noStroke();

    theShader = p.createShader(shader.vs, shader.fs);
    color_pg = rand_color('#FA9884');
  };

  p.draw = () => {
    p.translate(-p.width / 2, -p.height / 2);
    p.background('#EEE2DE');
    p.push();
    grid(12, pg_tile);
    p.image(pg_tile, 0, 0);
    p.pop();

    p.push();
    pg.background('#091221');
    // pg.background(220);
    pg.erase();
    pg.push();
    pg.circle(pg.width / 2, pg.height / 2, 400);
    pg.pop();
    pg.noErase();

    p.shader(theShader);
    theShader.setUniform(`u_tex`, pg);
    theShader.setUniform('u_resolution', [pg.width, pg.height]);
    theShader.setUniform(`u_time`, -p.frameCount / 35);
    theShader.setUniform(`u_color0`, color_pg);
    p.image(pg, 0, 0);
    p.pop();
  };

  p.keyPressed = () => {
    if (p.key === 's') {
      p.saveCanvas(canvas, 'p5js_rect-wave2', 'png');
      p.saveGif('p5js_rect-wave2', 4);
    }
  };

  /** num個で分割したグリッドを画面いっぱいに生成する
   * @function grid
   * @param  {Number}        num           画面の分割数
   */
  const grid = (num, pg) => {
    const n1 = num + 1;
    const width = pg.width * 2;
    const height = pg.height * 2;

    const margin_left = width / n1 / n1;
    const margin_bottom = height / n1 / n1;
    const nw = width / n1;
    const nh = height / n1;
    pg.push();
    pg.translate(-nw / 2, 0);
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
    pg.pop();
  };

  const rand_color = (colorCode) => {
    let rc = p.color(colorCode);
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
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_color0;

  float pi = 3.14159265358979;

  // グラデーションノイズ
  // 参考:https://nogson2.hatenablog.com/entry/2017/11/18/150645
  vec2 random(vec2 st){
      st = vec2( dot(st,vec2(127.1,311.7)),
                dot(st,vec2(269.5,183.3)) );
                
    return 2.0*fract(sin(st)*43758.5453123) - 1.0;
  }


  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix(dot( random(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                    dot( random(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix(dot( random(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                    dot( random(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
  }
  void main() {
    vec2 uv = vTexCoord;

    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec2 pos = vec2(st*10.0);
    vec3 noise =vec3( noise(pos)*.5+.5 );

    uv.x += 0.08 * cos(uv.y*pi*5.0 + u_time);
    vec3 color = mix(u_color0, noise, cos(uv.x*pi*5.0 + u_time));

    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = vec4(color, 1.0) * tex;
  }
`,
};
