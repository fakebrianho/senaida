uniform sampler2D matcapTexture;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    // Ensure normal is normalized
    vec3 normal = normalize(vNormal);
    
    // Calculate view-space normal
    vec3 viewDir = normalize(vViewPosition);
    vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
    vec3 y = cross(viewDir, x);
    vec2 uv = vec2(dot(x, normal), dot(y, normal)) * 0.495 + 0.5;
    
    // Sample matcap texture
    vec4 matcapColor = texture2D(matcapTexture, uv);
    
    gl_FragColor = matcapColor;
} 