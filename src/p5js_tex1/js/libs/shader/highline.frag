precision highp float;
precision highp int;

varying vec2 vTexCoord;

uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;

float pi = 3.14159265358979;
float X = .211324865405187;
float Y = .36602540378443;
float Z = -.577350269189626;
float W = .024390243902439;

vec3 permute(vec3 x) { return mod( x*x*34.+x, 289.); }

float snoise(vec2 v) {
	vec2 i = floor(v + (v.x+v.y)*Y),
    x0 = v -   i + (i.x+i.y)*X,
    j = step(x0.yx, x0),
    x1 = x0+X-j,
    x3 = x0+Z;
  i = mod(i,289.);
  
  vec3 p = permute( permute( i.y + vec3(0, j.y, 1 )) + i.x + vec3(0, j.x, 1 ) ),
    m = max( .5 - vec3(dot(x0,x0), dot(x1,x1), dot(x3,x3)), 0.),
    x = 2. * fract(p * W) - 1.,
    h = abs(x) - .5,
    a0 = x - floor(x + .5),
    g = a0 * vec3(x0.x,x1.x,x3.x) + h * vec3(x0.y,x1.y,x3.y);
	m = m*m*m*m* ( 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h ) );

	return .5 + 65. * dot(m, g);
}

void main() {
  vec2 uv = vTexCoord;

  vec2 p= vTexCoord;
  p.y += 0.09 * sin(p.x*pi*5.0 + u_time);
  
  vec3 col = 0.5 + 0.5*cos(u_time+uv.xyx+vec3(0,2,4));
  float l=.2;
  float f=5.;
  float n=snoise(p*5.)*.5+.5;
  float c=float(fract(n*f)<l);
  
  vec3 col_highline  = vec3(0,0,0);
  col_highline += vec3(c,c,c);

  vec4 tex = texture2D(u_tex, uv);

  if(vec3(0.0,0.0,0.0) == col_highline){
    gl_FragColor =  tex;
  }else{
    gl_FragColor =  vec4(col_highline,1.0);
  }
}

