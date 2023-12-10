export const shaderFish = {
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

  void main() {
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

    vec4 tex = texture2D(u_tex, uv);

    gl_FragColor = tex;
  }
`,
};
