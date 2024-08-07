varying vec3 vColor;
varying float vDistanceToCamera;

void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;
    
    // Debugging: Change color based on distance to camera
    vec3 debugColor = mix(vec3(1.0, 0.0, 0.0), vColor, smoothstep(0.0, 10.0, vDistanceToCamera));
    
    gl_FragColor = vec4(debugColor, strength);
}