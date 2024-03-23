precision highp float;
precision highp int;

varying vec2 vTexCoord;

uniform sampler2D u_tex;
uniform sampler2D u_pattern;

uniform float u_time;

float pi=3.14159265358979;

float rand(vec2 co){
  float a=fract(dot(co,vec2(2.067390879775102,12.451168662908249)))-.5;
  float s=a*(6.182785114200511+a*a*(-38.026512460676566+a*a*53.392573080032137));
  float t=fract(s*43758.5453);
  return t;
}

void main(){
  vec2 uv=vTexCoord;
  float radius=.004;
  uv.x=uv.x+rand(uv)*radius;
  uv.y=uv.y+rand(uv)*radius;
  
  vec4 tex_lattice=texture2D(u_pattern,uv);// 変換対象
  vec4 tex=texture2D(u_tex,uv);
  
  if(tex_lattice==vec4(vec3(1.,1.,1.),1.)){
    gl_FragColor=tex;
  }else{
    gl_FragColor=vec4(vec3(1.)-tex.rgb,1.);
  }
  
  float interval=3.;
  float strength=smoothstep(interval*.5,interval,interval-mod(0.,interval));
  float whiteNoise=(rand(uv+mod(0.,10.))*2.-1.)*(.15+strength*.15);
  gl_FragColor=gl_FragColor+whiteNoise;
}

