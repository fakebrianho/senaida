uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uNoiseTexture;
uniform vec2 uMouse; // Current interpolated mouse position

varying vec2 vUv;

#define time uTime*0.15
#define tau 6.2831853

// ... (other functions remain the same)

void main() {
    vec2 fragCoord = vUv * uResolution.xy;
    
    //setup system
    vec2 p = fragCoord.xy / uResolution.xy - 0.5;
    p.x *= uResolution.x / uResolution.y; // Maintain aspect ratio
    p *= 4.0;

    // Invert mouse coordinates in the shader
    vec2 invertedMouse = vec2(1.0 - uMouse.x, 1.0 - uMouse.y);

    // Adjust p based on the inverted mouse position
    p -= (invertedMouse - 0.5) * 2.0;

    float rz = dualfbm(p);
    
    //rings
    rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
    rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
    rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
    
    //final color
    vec3 col = vec3(.1,0.1,0.4)/rz;
    col=pow(abs(col),vec3(.99));
    gl_FragColor = vec4(col,1.);
}