uniform float uTime;
uniform float uSize;

attribute vec3 velocity;

varying vec3 vColor;

void main() {
    vec3 pos = position + velocity * uTime;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * (300.0 / -mvPosition.z);

    vColor = vec3(0.5 + 0.5 * sin(uTime + position.x),
                  0.5 + 0.5 * sin(uTime + position.y),
                  0.5 + 0.5 * sin(uTime + position.z));
}