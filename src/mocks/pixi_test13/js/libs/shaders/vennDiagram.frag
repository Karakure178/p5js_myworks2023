uniform sampler2D uSampler;
uniform sampler2D u_tex;

varying vec2 vTextureCoord;
uniform vec2 center;

uniform vec4 filterArea;
uniform vec4 filterClamp;

void main()
{
    float radius = 200.0;
    float strength = 0.4;
    vec2 dimensions = vec2(1.0, 1.0);
    vec2 coord = vTextureCoord * filterArea.xy;
    coord -= center * dimensions.xy;
    float distance = length(coord);
    if (distance < radius) {
        float percent = distance / radius;
        if (strength > 0.0) {
            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);
        } else {
            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);
        }
    }
    coord += center * dimensions.xy;
    coord /= filterArea.xy;
    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
    vec4 color = texture2D(uSampler, clampedCoord);
    if (coord != clampedCoord) {
        color *= max(0.0, 1.0 - length(coord - clampedCoord));
    }

    vec4 tex = texture2D(u_tex, vTextureCoord);
    if(color.a == 1.0){
        color = tex;
    }
    
//    vec4 frag =vec4(tex.r, color.g, color.b, 0.5);
    gl_FragColor = color;
}

