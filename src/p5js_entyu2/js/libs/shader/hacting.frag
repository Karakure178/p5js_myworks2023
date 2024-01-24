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
    float hatch = 3.0;// ハッチングのサイズを変えられる
    float lum = length(texture2D(u_tex, uv.xy).rgb);

    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    bool isHatch = false;

    if(lum < 1.45){
        if (mod(gl_FragCoord.x + gl_FragCoord.y, hatch) == 0.0){
            gl_FragColor = tex;
        isHatch = true;
        }
    }

    if(lum < 1.4){
        if (mod(gl_FragCoord.x + gl_FragCoord.y, hatch) == 0.0){
            gl_FragColor = tex;
        isHatch = true;
        }
    }

    if(lum < 1.2){
        if (mod(gl_FragCoord.x + gl_FragCoord.y, hatch) == 0.0){
            gl_FragColor = tex;
        isHatch = true;
        }
    }

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

    // if (lum < 0.3){
    //     if (mod(gl_FragCoord.x - gl_FragCoord.y - 7.0, hatch) == 0.0){
    //         gl_FragColor = tex;
    //         isHatch = true;
    //     }
    // }

    // if (lum < 0.1){
    //     if (mod(gl_FragCoord.x - gl_FragCoord.y - 10.0, hatch) != 0.0){
    //         gl_FragColor = tex;
    //         isHatch = true;
    //     }
    // }

    // if (lum < 0.05){
    //     if (mod(gl_FragCoord.x - gl_FragCoord.y - 15.0, hatch) != 0.0){
    //         gl_FragColor = tex;
    //         isHatch = true;
    //     }
    // }

    if(isHatch == false){
        gl_FragColor = vec4(u_color, 1.0);
    }

}

