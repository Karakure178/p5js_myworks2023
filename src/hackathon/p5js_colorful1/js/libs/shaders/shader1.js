export const shader1 = {
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
  uniform float u_aperture;

  float PI = 3.14159265358979;
  float interval = 3.0;


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

    // 魚眼レンズ用 : https://www.geeks3d.com/20140213/glsl-shader-library-fish-eye-and-dome-and-barrel-distortion-post-processing-filters/
    float apertureHalf = 0.5 * u_aperture * (PI / 180.0);
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

    // 走査線用:https://qiita.com/pentamania/items/d0b81f0c0e1805ca2f46
    float scanLineInterval = 1500.0; // 大きいほど幅狭く
    float scanLineSpeed = u_time * 5.0; // 走査線移動速度
    float scanLine = max(1.0, sin(vTexCoord.y * scanLineInterval + scanLineSpeed) * 1.6);

    vec4 tex = texture2D(u_tex, uv);
    tex.rgb *= scanLine;

    gl_FragColor = tex ;//+ whiteNoise;
    // gl_FragColor: tex*0.1のようにかけると全体的に色が薄くなる、結果として下が透ける
  }
`,
};
