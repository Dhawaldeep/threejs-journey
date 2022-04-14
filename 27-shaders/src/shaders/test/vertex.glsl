// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;
uniform vec3 uColor;
    
// attribute vec3 position;
// attribute vec2 uv;
attribute float aRandom;

varying float vRandom;
varying vec3 vColor;
varying vec2 vUv;
varying float vElevation;


// float loremIpsum() {
//     float a = 1.0;
//     float b = 1.0;

//     return a + b;
// }

// float loremIpsum(float a, float b) {
//     return a + b;
// }
    
void main() {
    // float a = 1.0;
    // float b = 1.0;
    // float c = a + b;

    // float a = 1.0;
    // int b = - 1;
    // float c = a * float(b); 

    // bool foo = true;
    // bool bar = false;

    // vec2 foo = vec2(-1.0, 3.0);
    // foo *= 2.0;
    // vec2 bar = vec2(0.0);
    // bar.x = 1.0;
    // bar.y = 2.0;

    // vec3 foo = vec3(1.0);
    // foo.z = 2.0;

    // vec2 foo = vec2(1.0, 2.0);
    // vec3 bar = vec3(foo, 3.0);

    // swizzle
    // vec3 foo = vec3(1.0, 2.0, 3.0);
    // vec2 bar = foo.yx;

    // vec4 foo = vec4(1.0, 2.0, 3.0, 4.0);
    // float bar = foo.w; // xyzw
    // float cbar = foo.a; // rgba

    // float result = loremIpsum();
    // float result = loremIpsum(1.0, 2.9);

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += aRandom * 0.1;
    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vRandom = aRandom;
    vColor = uColor;
    vUv = uv;
    vElevation = elevation;
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
