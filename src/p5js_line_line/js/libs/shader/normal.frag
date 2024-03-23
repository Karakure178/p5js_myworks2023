precision highp float;
precision highp int;

varying vec2 vTexCoord;

uniform sampler2D u_pattern;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec3 u_color;
uniform vec3 u_color2;

float pi=3.14159265358979;

// iosだと動かない可能性がある
// :https://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
float random(vec2 c){
  return fract(sin(dot(c.xy,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
  vec2 uv=vTexCoord;
  vec4 tex=texture2D(u_tex,uv);
  vec4 tex_lattice=texture2D(u_pattern,uv);// 変換対象
  
  // white noise用
  float interval=3.;
  float strength=smoothstep(interval*.5,interval,interval-mod(0.,interval));
  float whiteNoise=(random(uv+mod(0.,10.))*2.-1.)*(.15+strength*.15);
  
  if(tex_lattice==vec4(u_color,1.)){
    gl_FragColor=tex+whiteNoise;
  }else if(tex_lattice==vec4(u_color2,1.)){
    gl_FragColor=tex_lattice+whiteNoise;
  }else{
    // 黒を反転させる
    gl_FragColor=vec4(vec3(1.)-tex.rgb,1.)+whiteNoise;
  }
}

