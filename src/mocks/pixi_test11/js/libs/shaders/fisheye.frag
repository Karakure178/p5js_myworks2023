varying vec2 vTextureCoord;
uniform sampler2D u_tex;

float PI = 3.14159265358979;
void main() {
  vec2 uv = vTextureCoord;

  float apertureHalf = 0.5 * 180.0 * (PI / 180.0);
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
