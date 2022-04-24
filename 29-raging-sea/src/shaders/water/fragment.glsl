uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiply;

varying float vElevation;

void main() {
    // gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
    // gl_FragColor = vec4(uDepthColor, 1.0);
    // gl_FragColor = vec4(uSurfaceColor, 1.0);
    // gl_FragColor = vec4(vec3(vElevation), 1.0);

    float mixStrength = (vElevation + uColorOffset) * uColorMultiply;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    gl_FragColor = vec4(color, 1.0);
}