precision highp float;
precision highp int;

varying vec2 vTexCoord;

uniform sampler2D u_tex;
uniform sampler2D u_tex2;
uniform float u_time;

float PI = 3.14159265358979;

void main() {
    vec2 uv = vTexCoord;
    vec4 tex = texture2D(u_tex, uv);
    vec4 tex_lattice = texture2D(u_tex2, uv);
    if(tex_lattice == vec4(1.0, 1.0, 1.0, 1.0)){
      gl_FragColor = tex;
    }else{
      // 黒を反転させてる
      gl_FragColor = vec4(vec3(1.0) - tex.rgb,1.0);
    }
}