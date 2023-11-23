const shader = `#version 300 es

precision highp float;

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat3 normalMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

out vec2 vUv;
out float vRim;
out float vDepth;

void main() {
  vUv = uv;
  vUv.x += time * 0.0001;
  vUv.y += time * 0.0006;

  vec3 n = normalMatrix * normal;
  vec4 viewPosition = modelViewMatrix * vec4( position, 1. );
  vec3 eye = normalize(-viewPosition.xyz);
  vRim = 1.0 - abs(dot(eye,n));
  vRim = pow(vRim, 5.);
  vec3 worldPosition = (modelMatrix * vec4(position, 1.)).xyz;  
  gl_Position = projectionMatrix * viewPosition;
  vDepth = gl_Position.z;
}
`;

export { shader };

