uniform float uTime;
uniform float uSize;

attribute float aScale;

varying vec3 vColor;

void main() {
    vec3 pos = position;
    
    // Add a subtle, cyclical movement
    pos.x += sin(uTime * 0.2 + position.y) * 0.1;
    pos.y += cos(uTime * 0.2 + position.x) * 0.1;
    pos.z += sin(uTime * 0.2 + position.z) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Vary the size of each particle
    gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);

    // Create a smooth color transition
    vColor = 0.5 + 0.5 * cos(uTime * 0.5 + vec3(0.0, 2.0, 4.0) + length(position) * 0.2);
}