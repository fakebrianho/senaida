precision highp float;

uniform sampler2D u_matcapTextures; // Matcap texture sampler
uniform vec3 u_cameraPosition;      // Camera position in world space

varying vec3 v_normal;        // Interpolated normal from vertex shader
varying vec3 v_position;      // Vertex position in world space

void main() {
    // Normalize the vertex normal
    vec3 normal = normalize(v_normal);
    
    // Calculate view direction
    vec3 viewDir = normalize(u_cameraPosition - v_position);
    
    // Calculate view space normal
    vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
    vec3 y = cross(viewDir, x);
    vec2 uv = vec2(dot(x, normal), dot(y, normal)) * 0.495 + 0.5;
    
    // Sample matcap texture
    vec4 matcapColor = texture2D(u_matcapTextures, uv);
    
    // Output final color
    gl_FragColor = matcapColor;
}