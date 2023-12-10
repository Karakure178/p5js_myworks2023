export const shaderHatch = {
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
  uniform vec3 u_color;

  float PI = 3.14159265358979;

  void main() {
    vec2 uv = vTexCoord;

    // ハッチング: https://github.com/pixijs/filters/blob/main/filters/cross-hatch/src/crosshatch.frag
    float hatch = 2.0;// ハッチングのサイズを変えられる
    float lum = length(texture2D(u_tex, uv.xy).rgb);

    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    bool isHatch = false;

    if (lum < 1.00){
      if (mod(gl_FragCoord.x + gl_FragCoord.y, hatch) == 0.0){
        gl_FragColor = tex;
        isHatch = true;
      }
    }

    if (lum < 0.75){
      if (mod(gl_FragCoord.x - gl_FragCoord.y, hatch) == 0.0){
          gl_FragColor = tex;
          isHatch = true;
      }
    }

    if (lum < 0.50){
      if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, hatch) == 0.0){
          gl_FragColor = tex;
          isHatch = true;
      }
    }

    if (lum < 0.3){
      if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, hatch) == 0.0){
          gl_FragColor = tex;
          isHatch = true;
      }
    }

    if (lum < 0.1){
      if (mod(gl_FragCoord.x + gl_FragCoord.y - 7.0, hatch) == 0.0){
          gl_FragColor = tex;
          isHatch = true;
      }
    }

    if (lum < 0.05){
      if (mod(gl_FragCoord.x - gl_FragCoord.y - 7.0, hatch) == 0.0){
          gl_FragColor = tex;
          isHatch = true;
      }
    }

    if(isHatch == false){
      gl_FragColor = vec4(vec3(0.92,0.89,0.81), 1.0);
    }

  }
`,
};
