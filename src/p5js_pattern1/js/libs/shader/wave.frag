precision highp float;
precision highp int;

varying vec2 vTexCoord;

uniform sampler2D u_tex;
uniform float u_time;

float pi = 3.14159265358979;

void main() {
  vec2 uv = vTexCoord;
  uv.y += 0.09 * sin(uv.x*pi*5.0 + u_time);
  vec4 tex = texture2D(u_tex, uv);
  gl_FragColor = tex;
}

