
//  运行 ctrl+shift+p -> show gltfcanvas

// 画圆

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
  
vec3 palette(float t){
    vec3 a=vec3(.5,.5,.5);
    vec3 b=vec3(.5,.5,.5);
    vec3 c=vec3(1.,1.,1.);
    vec3 d=vec3(.263,.416,.557);
    return a+b*cos(6.28318*(c*t+d));
}
void main(){
    vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/u_resolution.y;
    
    vec2 uv0=uv;
    vec3 finalColor=vec3(0.); 
    for(float i=0.;i<4.;i++){
        uv=fract(uv*1.5)-.5;
        float d=length(uv)*exp(-length(uv0));
        
        vec3 col=palette(length(uv0)+i*.4+u_time*.04);
        
        d=sin(d*8.+u_time)/8.;
        d=abs(d);
        
        d=pow(.01/d,1.2);
        
        finalColor+=(col*d);
    }
    gl_FragColor=vec4(finalColor,1);
    
}
