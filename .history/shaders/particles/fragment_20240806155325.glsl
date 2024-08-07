// varying vec3 vColor;

void main() {
    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 0.5 - strength;
    strength = pow(strength, 10.0);

    gl_FragColor = vec4(vec3(strength), 1.0);
}