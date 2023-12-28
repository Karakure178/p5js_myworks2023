  precision highp float;
  precision highp int;

  varying vec2 vTexCoord;

  uniform sampler2D u_tex;
  uniform float u_time;
  uniform vec2 u_resolution;

  void main() {
    const float Pi = 6.28318530718;
    const float Directions = 16.0; // BLUR DIRECTIONS
    const float Quality = 20.0; // BLUR QUALITY 
    const float Size = 20.0; // BLUR SIZE 

    vec2 Radius = Size/u_resolution.xy;
    
    vec2 uv = vTexCoord; // / u_resolution.xy;
    vec4 Color = texture2D(u_tex, uv);
    
    for( float d=0.0; d<Pi; d+=Pi/Directions){
		for(float i=1.0/Quality; i<=1.0; i+=1.0/Quality){
			Color += texture2D( u_tex, uv+vec2(cos(d),sin(d))*Radius*i);		
        }
    }
    
    Color /= Quality * Directions - 15.0;
    gl_FragColor = Color;

    float c = step(0.8, float(Color));
    //gl_FragColor =  vec4(c, c, c, 1.0);
    
    //vec4 tex = texture2D(u_tex,vTexCoord);
    //gl_FragColor = tex;
  }
