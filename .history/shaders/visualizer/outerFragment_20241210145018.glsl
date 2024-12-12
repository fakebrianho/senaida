uniform float uTime;

varying vec3 vNormal;
varying float lowFreq;
varying float medFreq;
varying float highFreq;
varying float lowPower;
varying float medPower;
varying float highPower;

void main() {
    // Normalize the normal vector
    vec3 normal = normalize(vNormal);
    
    // Create a basic fresnel effect
    vec3 viewDir = vec3(0.0, 0.0, 1.0); // Assuming camera is looking down Z
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
    
    // Create base glass color (slight blue tint)
    vec3 glassColor = vec3(0.8, 0.9, 1.0);
    
    // Add some chromatic aberration and distortion based on audio
    vec3 refraction = vec3(
        lowFreq * lowPower * sin(uTime * 0.5),
        medFreq * medPower * sin(uTime * 0.3),
        highFreq * highPower * sin(uTime * 0.7)
    ) * 0.1; // Reduce the intensity
    
    // Combine effects
    vec3 finalColor = mix(
        glassColor + refraction,
        vec3(1.0), // Reflection color (white)
        fresnel
    );
    
    // Add some sparkle/highlights
    float sparkle = pow(fresnel, 8.0) * (sin(uTime * 2.0) * 0.5 + 0.5);
    finalColor += sparkle;
    
    // Add transparency
    float alpha = 0.7 + 0.3 * fresnel; // More transparent in the middle, more opaque at edges
    
    gl_FragColor = vec4(finalColor, alpha);
}