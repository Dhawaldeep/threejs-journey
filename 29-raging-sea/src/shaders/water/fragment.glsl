uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiply;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
varying float vElevation;

void main() {
    // gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
    // gl_FragColor = vec4(uDepthColor, 1.0);
    // gl_FragColor = vec4(uSurfaceColor, 1.0);
    // gl_FragColor = vec4(vec3(vElevation), 1.0);

    float mixStrength = (vElevation + uColorOffset) * uColorMultiply;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
    float outline = step(0.1, vElevation) * 0.1;
    float outlineTwo = outline + step(0.15, vElevation) * 0.1;
    gl_FragColor = vec4(gl_FragColor.rgb + outlineTwo, 1.0);
    #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
            float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
            float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif
}