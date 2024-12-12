uniform float uTime;

varying vec3 vNormal;
varying float lowFreq;
varying float medFreq;
varying float highFreq;
varying float lowPower;
varying float medPower;
varying float highPower;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    
    // More subtle glass color (very light blue)
    vec3 glassColor = vec3(0.92, 0.95, 0.98) * 0.3; // Reduced brightness
    
    // Stronger refraction effect
    vec3 refraction = vec3(
        lowFreq * lowPower * sin(uTime * 0.5),
        medFreq * medPower * sin(uTime * 0.3),
        highFreq * highPower * sin(uTime * 0.7)
    ) * 0.2; // Increased distortion
    
    // More subtle reflection mix
    vec3 finalColor = mix(
        glassColor + refraction,
        vec3(0.1), // Dimmer reflection
        fresnel * 0.2 // Reduced fresnel effect
    );
    
    // More subtle sparkle
    float sparkle = pow(fresnel, 16.0) * (sin(uTime * 2.0) * 0.3 + 0.3);
    finalColor += sparkle;
    
    // More transparency
    float alpha = 0.2 + 0.3 * fresnel; // Much more transparent overall
    
    gl_FragColor = vec4(finalColor, alpha);
}