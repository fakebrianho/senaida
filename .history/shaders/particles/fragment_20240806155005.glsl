// varying vec3 vColor;

void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;

    gl_FragColor = vec4(vec3(strength), 1.0);
}