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
    
    // Light properties
    vec3 lightPos = vec3(2.0, 2.0, 2.0);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    
    // Calculate light direction
    vec3 lightDir = normalize(lightPos);
    
    // Diffuse lighting
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * lightColor * 0.5; // Reduced diffuse intensity
    
    // Specular lighting
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = spec * lightColor * 0.8;
    
    // Fresnel effect
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    
    // Glass properties
    vec3 glassColor = vec3(0.92, 0.95, 0.98) * 0.2;
    
    // Refraction with audio reactivity
    vec3 refraction = vec3(
        lowFreq * lowPower * sin(uTime * 0.5),
        medFreq * medPower * sin(uTime * 0.3),
        highFreq * highPower * sin(uTime * 0.7)
    ) * 0.15;
    
    // Combine all lighting components
    vec3 finalColor = (glassColor + refraction) * (diffuse + 0.1) + // Ambient light of 0.1
                     specular * (1.0 + highFreq * 0.5); // Audio-reactive specular
    
    // Add subtle rim lighting
    float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);
    finalColor += rim * vec3(0.3, 0.4, 0.5) * 0.3;
    
    // Subtle sparkle
    float sparkle = pow(spec, 8.0) * (sin(uTime * 2.0) * 0.2 + 0.2);
    finalColor += sparkle;
    
    // Transparency
    float alpha = 0.2 + 0.4 * fresnel;
    
    gl_FragColor = vec4(finalColor, alpha);
}