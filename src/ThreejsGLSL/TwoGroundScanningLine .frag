#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
void main()
{
    //uv handle---------------------------------------------------
    vec2 p = gl_FragCoord.xy/u_resolution.xy; 
     vec3 col = vec3(0.); 
     // dof
    const float focus =  0.15;
    const vec2 offsetPixel = vec2(1200.0,600.0);//vec2(800.0,450.0);

    vec4 acc = vec4(0.0);
    const int N = 4;
	for( int j=-N; j<=N; j++ )
    for( int i=-N; i<=N; i++ )
    {
        vec2 off = vec2(float(i),float(j));
        vec4 tmp = texture( iChannel1, p + off/offsetPixel ); 
        float depth = tmp.w;
        vec3  color = tmp.xyz;
        float coc = 0.05 + 12.0*abs(depth-focus)/depth;
        if( dot(off,off) < (coc*coc) )
        {
            float w = 1.0/(coc*coc); 
            acc += vec4(color*w,w);
        }
    }
    col = acc.xyz ;
    col = col*1.1 - 0.06;
    // vignetting
    col *= 0.8 + 0.3*sqrt( 16.0*p.x*p.y*(1.0-p.x)*(1.0-p.y) );
    col *=  0.95;
    vec4 col1 = texture( iChannel1, p );
    col = mix(col,col1.xyz,smoothstep(2.1,0.4,col1.w));
    // gamma
    col = pow( col, vec3(0.4545) );
    gl_FragColor = vec4(col,1.0);
}