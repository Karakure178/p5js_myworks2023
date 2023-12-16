varying vec2 vTextureCoord;

uniform float dispFactor; // bool = trueなら動く time
uniform sampler2D disp;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform float angle1;
uniform float angle2;
uniform float intensity1;
uniform float intensity2;
uniform vec4 res;

float PI = 3.14159265358979;

mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 vUv = vTextureCoord;
  vec4 disp = u_texture2D(disp, vUv);
  vec2 dispVec = vec2(disp.r, disp.b);

  vec2 uv = gl_FragCoord.xy / res.xy ;
  vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);

  vec2 distortedPosition1 = myUV + getRotM(angle1) * dispVec * intensity1 * dispFactor;
  vec2 distortedPosition2 = myUV + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);

  vec4 _u_texture1 = u_texture2D(u_texture1, distortedPosition1);
  vec4 _u_texture2 = u_texture2D(u_texture2, distortedPosition2);

  gl_FragColor = mix(_u_texture1, _u_texture2, dispFactor);
}
