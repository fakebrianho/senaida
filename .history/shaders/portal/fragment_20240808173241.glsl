uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uNoiseTexture;
uniform vec2 uMouse; // Add mouse uniform

varying vec2 vUv;

#define time uTime*0.15
#define tau 6.2831853

mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
float noise( in vec2 x ){return texture2D(uNoiseTexture, x*.01).x;}

float fbm(in vec2 p)
{	
    vec4 tt = fract(vec4(time * 2.0) + vec4(0.0, 0.25, 0.5, 0.75));
    vec2 p1 = p - normalize(p) * tt.x;
    vec2 p2 = vec2(1.0) + p - normalize(p) * tt.y;
    vec2 p3 = vec2(2.0) + p - normalize(p) * tt.z;
    vec2 p4 = vec2(3.0) + p - normalize(p) * tt.w;
    vec4 tr = vec4(1.0) - abs(tt - vec4(0.5)) * 2.0;
    float z = 2.0;
    vec4 rz = vec4(0.0);
    for (float i = 1.0; i < 8.0; i++) // Increased iterations from 4 to 8
    {
        rz += abs((vec4(noise(p1), noise(p2), noise(p3), noise(p4)) - vec4(0.5)) * 2.0) / z;
        z = z * 2.0;
        p1 = p1 * 2.0;
        p2 = p2 * 2.0;
        p3 = p3 * 2.0;
        p4 = p4 * 2.0;
    }
    return dot(rz, tr) * 0.2; // Adjusted scaling factor
}
float dualfbm(in vec2 p)
{
    //get two rotated fbm calls and displace the domain
	vec2 p2 = p*.7;
	vec2 basis = vec2(fbm(p2-time*1.6),fbm(p2+time*1.7));
	basis = (basis-.5)*.2;
	p += basis;
	
	//coloring
	return fbm(p);
}

float circ(vec2 p) 
{
	float r = length(p);
	r = log(sqrt(r));
	return abs(mod(r*2.,tau)-3.14)*5.+ 1.;
}

void main() {
	vec2 fragCoord = vUv * uResolution.xy;
	
	//setup system
    vec2 p = fragCoord.xy / uResolution.xy - 0.5;
    p.x *= uResolution.x / uResolution.y; // Maintain aspect ratio
    p *= 4.0;

	
    vec2 invertedMouse = vec2(1.0 -uMouse.x, 1.0 - uMouse.y);

    vec2 currentMouse = mix(p, invertedMouse, 0.1);
    p += (currentMouse - 0.5) * 2.0;
    // p += (invertedMouse - 0.5) * 2.0;

    float rz = dualfbm(p);
	
	//rings
	rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
    rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
    rz *= abs((-circ(vec2(p.x / 4.2, p.y / 7.0))));
	
	//final color
	vec3 col = vec3(.1,0.1,0.4)/rz;
	col=pow(abs(col),vec3(.99));
	gl_FragColor = vec4(col,1.);
}