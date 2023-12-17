//uniform vec2 center;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
uniform vec2 center;

uniform vec4 filterArea;
uniform vec4 filterClamp;
//uniform vec2 dimensions;

// https://github.com/pixijs/filters/blob/main/filters/bulge-pinch/src/bulgePinch.frag
void main()
{
    float radius = 400.0;
    float strength = 1.0;
    //vec2 center = vec2(600.0, 600.0);
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

    gl_FragColor = color;
}


// varying vec2 vTextureCoord;
// uniform sampler2D u_tex;

// float PI = 3.14159265358979;
// void main() {
//   vec2 uv = vTextureCoord;

//   float apertureHalf = 0.5* 180.0 * (PI / 180.0);
//   float maxFactor = sin(apertureHalf);

//   vec2 xy = 2.0 * uv.xy - 1.0;
//   float d = length(xy);

//   if (d < (2.0-maxFactor)){
//     d = length(xy * maxFactor);
//     float z = sqrt(1.0 - d * d);
//     float r = atan(d, z) / PI*2.0;
//     float phi = atan(xy.y, xy.x);
      
//     uv.x = r * cos(phi) + 0.5;
//     uv.y = r * sin(phi) + 0.5;
//   }

//   vec4 tex = texture2D(u_tex, uv);
//   gl_FragColor = tex;
// }
