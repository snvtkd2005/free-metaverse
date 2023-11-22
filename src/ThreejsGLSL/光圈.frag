
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
// uniform float scale;
// uniform vec3 color1;
// uniform vec3 color2;
void main(){
    
    vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/u_resolution.y +0.5;
    // vec2 uv= gl_FragCoord.xy;
    // float scale = 1.1 * saturate(sin(u_time))  ;
    float scale = 1.0 * abs(sin(u_time)) +0.2 ;
    float dis = distance(uv,vec2(.5,.5));

    float opacity = smoothstep(.4*scale,.5*scale,dis );
    // vec3 disColor= color1 - color2;
    vec3 disColor=vec3(1.,1.,0.)-vec3(1.,0.,1.);
    // float depth = distance( modelPosition.xyz,vec3(cameraPosX,cameraPosY,cameraPosZ)); 
    // float depth = distance(vec3(1.1,0.,0.),vec3(0,0,0)); 

    vec3 color=vec3(1.,0.,1.)+ disColor * scale;
    if(dis >  .5 * scale){
        discard;
    }
    gl_FragColor=vec4(color,opacity);
     
}