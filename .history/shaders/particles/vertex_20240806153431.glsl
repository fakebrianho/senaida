uniform float uTime;
uniform float uSize;
uniform vec3 uCameraPosition;

attribute float aScale;


void main() {
    vec3 pos = position;
    
    // Add some movement based on time
    pos.y += sin(uTime * 0.5 + position.x * 2.0) * 0.05;
    pos.x += cos(uTime * 0.5 + position.r * 2.0) * 0.05;
    
    // Calculate distance to camera
    // vDistanceToCamera = distance(pos, uCameraPosition);
    // float minDistance = 1.0; // Adjust this value to set the minimum allowed distance
    
    // if (vDistanceToCamera < minDistance) {
    //     // Move the particle to the back
    //     pos = normalize(pos - uCameraPosition) * -10.0 + uCameraPosition; // Adjust 10.0 to change how far back it goes
    // }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);

    // Debug color: red if too close, blue otherwise
  
}