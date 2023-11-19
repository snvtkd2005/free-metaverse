
//  运行 ctrl+shift+p -> show gltfcanvas

// 画圆

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
void main(){
    vec2 st=gl_FragCoord.xy/u_resolution-.5;
    
    vec3 color=vec3(1.);
    float lengthV=length(st);//长度计算，做渐变
    float stepV=step(.2,lengthV);//非黑即白。 >0.5 则=1 ， <0.5 则=0
    
    // color=(1.0-length(st-vec2(-0.12,0.12))*3.);

    color+=(1.0-length(st-vec2(-0.12,0.12))*3.)*(1.0-0.1);
    gl_FragColor=vec4(color,1);
    
}
