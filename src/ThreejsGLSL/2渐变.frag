
//  运行 ctrl+shift+p -> show gltfcanvas

// 画圆

#ifdef GL_ES
precision mediump float;
#endif
 
uniform vec2 u_resolution;
void main(){
    vec2 st =  gl_FragCoord.xy/u_resolution - 0.5;
    float lengthV = length(st); //长度计算，做渐变
    float stepV = 1.- step(0.1,lengthV); //非黑即白。 >0.5 则=1 ， <0.5 则=0
    gl_FragColor = vec4(stepV,stepV,stepV,1);

}
