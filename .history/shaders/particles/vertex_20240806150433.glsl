uniform float uTime;
uniform float uSize;
uniform vec3 uCameraPosition;

attribute float aScale;

varying vec3 vColor;
varying float vDistanceToCamera;

void main() {
    vec3 pos = position;
    
    // Add some movement based on time
    pos.y += sin(uTime * 0.5 + position.x * 2.0) * 0.1;
    pos.x += cos(uTime * 0.5 + position.z * 2.0) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Calculate distance to camera
    vDistanceToCamera = length(uCameraPosition - mvPosition.xyz);
    float minDistance = 1.0; // Adjust this value to set the minimum allowed distance
    
    if (vDistanceToCamera < minDistance) {
        // Move the particle to the back
        pos = normalize(pos) * 10.0; // Adjust 10.0 to change how far back it goes
        mvPosition = modelViewMatrix * vec4(pos, 1.0);
    }
    
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
    // gl_PointSize = 15.0;

    // Debug color: red if too close, blue otherwise
    if (vDistanceToCamera < minDistance) {
        vColor = vec3(1.0, 0.0, 0.0); // Red
    } else {
        vColor = vec3(0.0, 0.0, 1.0); // Blue
    }
}