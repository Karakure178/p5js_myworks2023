export const shaderScan = {
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

  void main() {
    vec2 uv = vTexCoord;
    vec4 tex = texture2D(u_tex, uv);

    // 走査線を書く
    float scanLineInterval = 1500.0; // 大きいほど幅狭く
    float scanLineSpeed = u_time * 5.0; // 走査線移動速度
    float scanLine = max(1.0, sin(uv.y * scanLineInterval + scanLineSpeed) * 1.6);

    tex.rgb *= scanLine;


    gl_FragColor = tex;
  }
`,
};
