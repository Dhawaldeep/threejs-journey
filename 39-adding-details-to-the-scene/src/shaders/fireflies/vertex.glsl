uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() {
    vec4 modelPostion = modelMatrix * vec4(position, 1.0);
    modelPostion.y += sin(uTime + modelPostion.x * 100.0) * aScale * 0.2;
    vec4 viewPosition = viewMatrix * modelPostion;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= - (1.0 / viewPosition.z);
}