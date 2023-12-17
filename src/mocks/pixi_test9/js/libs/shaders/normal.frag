varying vec2 vTextureCoord;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;
float PI = 3.14159265358979;

void main() {
  vec2 uv = vTextureCoord;
  vec4 tex = texture2D(u_tex, uv);
  gl_FragColor = tex;
}
