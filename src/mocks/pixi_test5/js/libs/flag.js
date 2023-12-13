// https://rupert-rothschildvignerons.com/wines
export const postprocessing = `precision mediump float;
#define GLSLIFY 1
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform sampler2D uRenderTexture;
uniform sampler2D u_DisplacementTexture;
uniform vec2 u_Resolution;
uniform float u_IntroProgress;
uniform float u_IntroMaskSize;
uniform float u_OverlayVisibility;

float Circle(in vec2 st, in float radius, in float blur){
  return 1. - smoothstep(radius - (radius*blur), radius+(radius*blur), dot(st,st) * 4.0);
}

float blendOverlay(float base, float blend) {
  return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
  return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
  return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendNormal(vec3 base, vec3 blend) {
  return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
  return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
  vec2 textCoords = vTextureCoord;
  // Displacement texture to, guess what, displace the outputs
  
  vec4 displacement = texture2D(u_DisplacementTexture, textCoords);
  // Circular imask with some displacement applied
  // float introMask = Circle(textCoords - vec2(0.5) + displacement.r, u_IntroMaskSize * 14., 0.1);
  // float introMask = Circle(textCoords - vec2(0.5), u_IntroMaskSize * 4., 0.2);  
  
  // 1. Zoom the image from 0.8 to 1.0 
  float introZoom = 0.8 + u_IntroProgress*0.2;
  
  // 2. Apply some displacement on the image from 0.08 to 0.0
  float displace = displacement.g*(0.2 - 0.2*u_IntroProgress);

  // 3. Calculate the ST of the texture 
  vec2 stOutput = (textCoords * 2.0 - 1.0) * introZoom + displace;
  
  // 4. Get the texture
  vec4 img = texture2D(uRenderTexture, stOutput * 0.5 + 0.5);

  /**\n     * Set the output lower layer\n     */
  // vec3 lowerLayer = img.rgb * introMask;
  vec3 lowerLayer = img.rgb;

  // Blue overlay color
  vec3 overlayColor = vec3(12., 29., 50.) / 255.;
  // BW
  vec3 lowerLayerBW = vec3((lowerLayer.r + lowerLayer.g + lowerLayer.b) / 3.);    
  // Apply overlay\n    
  lowerLayer = blendOverlay(lowerLayerBW, overlayColor, 0.5);
  
  /**\n     * Set the output upper layer\n     */\n    
  // float upperLayerMask = Circle(\n    
  //     (textCoords * vec2(-.7, -.6) - vec2(0.5) + displacement.r * (.55 + .25 * u_OverlayVisibility)),\n    
  //     14. * u_OverlayVisibility,\n    
  //     .1 * u_OverlayVisibility\n    // );\n\n    
  
  vec3 upperLayer = img.rgb;\n\n    
  
  // The final color is a combination of the lower and upper layers\n    
  // vec3 color = blendNormal(lowerLayer, upperLayer, upperLayerMask);\n    
  vec3 color = blendNormal(lowerLayer, upperLayer, u_OverlayVisibility);
  gl_FragColor = vec4(color, 1.0);
}`;
