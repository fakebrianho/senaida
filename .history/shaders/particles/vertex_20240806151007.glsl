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
    vDistanceToCamera = length(mvPosition.xyz);
    float minDistance = 1.0; // Adjust this value to set the minimum allowed distance
    
    // Discard particles that are too close to the camera
    if (vDistanceToCamera < minDistance) {
        gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // Move it out of view
        return;
    }
    
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);

    vColor = vec3(0.5 + 0.5 * sin(uTime + position.x),
                  0.5 + 0.5 * sin(uTime + position.y),
                  0.5 + 0.5 * sin(uTime + position.z));
}