precision mediump float;
// varying float vRandom;
varying vec3 vColor;
varying vec2 vUv;

uniform sampler2D uTexture;

void main() {
    // vec3 purpleColor = vec3(0.0);
    // purpleColor.r = 0.5;
    // purpleColor.b = 1.5;
    vec4 textureColor = texture2D(uTexture, vUv);

    // gl_FragColor = vec4(0.5, vRandom, 1.0, 1.0);
    // gl_FragColor = vec4(vColor, 1.0);
    gl_FragColor = textureColor;
}
