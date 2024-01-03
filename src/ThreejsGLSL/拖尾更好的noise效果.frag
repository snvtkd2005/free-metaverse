
//  运行 ctrl+shift+p -> show gltfcanvas

// 画圆

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 hash(vec2 p)// replace this by something better
{
    p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
    return-1.+2.*fract(sin(p)*43758.5453123);
}

float noise(in vec2 p)
{
    const float K1=.366025404;// (sqrt(3)-1)/2;
    const float K2=.211324865;// (3-sqrt(3))/6;
    
    vec2 i=floor(p+(p.x+p.y)*K1);
    vec2 a=p-i+(i.x+i.y)*K2;
    float m=step(a.y,a.x);
    vec2 o=vec2(m,1.-m);
    vec2 b=a-o+K2;
    vec2 c=a-1.+2.*K2;
    vec3 h=max(.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.);
    vec3 n=h*h*h*h*vec3(dot(a,hash(i+0.)),dot(b,hash(i+o)),dot(c,hash(i+1.)));
    return dot(n,vec3(70.));
}

void main(){
    vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/u_resolution.y;
    
    vec2 uv0=uv;
    uv0.x+=-u_time*.5;
    
    float noiseValue=(noise((uv0*35.)));
    
    noiseValue=0.;
    uv0*=5.;
    mat2 m=mat2(1.6,1.2,-1.2,1.6);
    noiseValue=.5000*noise(uv0);uv0=m*uv0;
    noiseValue+=.2500*noise(uv0);uv0=m*uv0;
    noiseValue+=.1250*noise(uv0);uv0=m*uv0;
    noiseValue+=.0625*noise(uv0);uv0=m*uv0;
    noiseValue=.5+.5*noiseValue;
       
    float onemlnus=(1.-(uv.r));
    
    float add=noiseValue+onemlnus;
    float subtract=add-uv.r;
    float finalValue=subtract;
    
    vec3 finalColor=mix(vec3(1.,0.,0),vec3(1.,.5,0.),.5)*finalValue;
    
    gl_FragColor=vec4(finalColor,1);
    // gl_FragColor=vec4(vec3(1.)*(1.-noiseValue),1);
    // gl_FragColor=vec4(vec3(1.)*(noiseValue),1);
    
}
