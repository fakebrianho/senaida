varying vec3 vColor;
varying float vDistance;

void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;
    
    // Fade out particles that are too close to the camera
    float minDistance = 1.0; // Adjust this value to set the fade-out distance
    float fadeStrength = smoothstep(0.0, minDistance, vDistance);
    
    gl_FragColor = vec4(vColor, strength * fadeStrength);
}