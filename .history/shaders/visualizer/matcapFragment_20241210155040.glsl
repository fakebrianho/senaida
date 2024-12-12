precision highp float;

uniform sampler2D u_matcapTextures; // Matcap texture sampler
uniform vec3 u_cameraPosition;      // Camera position in world space

varying vec3 v_normal;        // Interpolated normal from vertex shader
varying vec3 v_position;      // Vertex position in world space
uniform sampler2D u_depthTexture;     // Scene depth texture
uniform vec2 u_resolution;            // Screen resolution
uniform float u_transparency;         // Control overall transparency
uniform float u_refractPower;        // Control refraction strength
uniform mat4 u_projectionMatrix;     // Projection matrix for depth calculations


void main() {
    // Calculate screen UV coordinates
    vec2 screenUV = gl_FragCoord.xy / u_resolution;
    
    // Basic matcap UV calculation
    vec3 normal = normalize(v_normal);
    vec3 viewDir = normalize(-v_position);
    vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
    vec3 y = cross(viewDir, x);
    vec2 matcapUV = vec2(dot(x, normal), dot(y, normal)) * 0.495 + 0.5;

    // Sample matcap texture
    vec4 matcapColor = texture2D(u_matcapTextures, matcapUV);
    matcapColor.rgb *= 0.8;

    
    // Calculate refraction offset
    vec2 refractOffset = normal.xy * u_refractPower;
    vec2 refractionUV = screenUV + refractOffset;
    
    // Sample scene depth
    float sceneDepth = texture2D(u_depthTexture, refractionUV).r;
    
    // Blend between matcap and refracted background
    vec4 finalColor = matcapColor;
    finalColor.a = u_transparency;
    
    // Enable depth testing but still write transparent colors
    gl_FragColor = finalColor;
}