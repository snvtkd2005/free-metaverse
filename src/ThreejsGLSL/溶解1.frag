
//  运行 ctrl+shift+p -> show gltfcanvas

// 画圆

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
  
vec2 hash( vec2 p ) // replace this by something better
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

    vec2  i = floor( p + (p.x+p.y)*K1 );
    vec2  a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x); 
    vec2  o = vec2(m,1.0-m);
    vec2  b = a - o + K2;
    vec2  c = a - 1.0 + 2.0*K2;
    vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
} 
void main(){
    vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/u_resolution.y ;
    
    vec2 uv0=uv;
    float noiseValue = (noise(uv0*3.));
    float m = step(sin(u_time), noiseValue );
    vec3 finalColor= vec3(1) - vec3(1) * m ; 

    // vec3 col =vec3(0.8353, 0.1686, 0.1686) * step(sin(u_time)+1., noiseValue ) ;
    // finalColor+=(col);
    vec3 col =vec3(1,1, 1) * (sin(u_time)) ;

    finalColor += (col*2.); 
    gl_FragColor=vec4(finalColor,1);
    
}
