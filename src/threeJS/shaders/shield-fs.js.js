const shader = /* glsl */ `#version 300 es

precision highp float;

#include <packing>

uniform sampler2D depthBuffer;
uniform vec2 resolution;
uniform float time;
uniform sampler2D u_tex;

in float vRim;
in vec2 vUv;
in float vDepth;

out vec4 color;

const vec4 baseColor = vec4(0.0,0.9,0.0,0.1);

void main() {
    // 基础色
    color = baseColor;

    // 动态纹理
    vec4 maskA = texture(u_tex, vUv);
    maskA.a = maskA.r;
    color += maskA;
    
    // 边界高亮
    vec2 uv = gl_FragCoord.xy / resolution;
    vec4 packedDepth = texture(depthBuffer, uv);
    float sceneDepth = unpackRGBAToDepth(packedDepth);
    float depth = (vDepth - .1) / ( 10.0 -.1);
    float diff = abs(depth - sceneDepth);
    float contact = diff * 20.;
    contact = 1. - contact;
    contact = max(contact, 0.);
    contact = pow(contact, 20.);
    contact *= diff*1000.;
    float a = max(contact, vRim);
    float fade = 1. - pow(vRim, 10.);
    color += a * fade;
    
    // gl_FragColor = vec4(color, color.a);
}
`;

export { shader };

