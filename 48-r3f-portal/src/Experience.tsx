import { useRef } from 'react'
import { OrbitControls, useGLTF, useTexture, Center, Sparkles, shaderMaterial } from '@react-three/drei'
import { extend, Object3DNode, useFrame } from '@react-three/fiber'
import vertexShader from "./shaders/portal/vertex.glsl"
import fragmentShader from "./shaders/portal/fragment.glsl"
import { Color, ShaderMaterial } from 'three/src/Three';

const PortalMaterial = shaderMaterial({
    uTime: 0,
    uColorStart: new Color('#ffffff'),
    uColorEnd: new Color('#000000')
}, vertexShader, fragmentShader);

extend({ PortalMaterial })

declare module '@react-three/fiber' {
    interface ThreeElements {
        portalMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial>
    }
}

export default function Experience() {
    const portalMaterial = useRef(null)
    const gltf = useGLTF("/model/portal.glb");
    const bakedTexture = useTexture("/model/baked.jpg");
    // console.log(gltf);

    const nodes = (gltf as any).nodes;

    useFrame((_, delta) => {
        (portalMaterial.current as any).uTime += delta
    })

    return <>

        <OrbitControls makeDefault />

        {/* <mesh scale={ 1.5 }>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh> */}

        <Center>
            <mesh
                geometry={nodes.baked.geometry}
            >
                <meshBasicMaterial
                    map={bakedTexture}
                    map-flipY={false}
                />
            </mesh>

            <mesh
                geometry={nodes.poleLightA.geometry}
                position={nodes.poleLightA.position}
                rotation={nodes.poleLightA.rotation}
                scale={nodes.poleLightA.scale}
            />

            <mesh
                geometry={nodes.poleLightB.geometry}
                position={nodes.poleLightB.position}
                rotation={nodes.poleLightB.rotation}
                scale={nodes.poleLightB.scale}
            />

            <mesh
                geometry={nodes.portalLight.geometry}
                position={nodes.portalLight.position}
                rotation={nodes.portalLight.rotation}
                scale={nodes.portalLight.scale}
            >
                {/* <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        uTime: { value: 0 },
                        uColorStart: { value: new Color('#ffffff') },
                        uColorEnd: { value: new Color('#000000') }
                    }}
                /> */}
                <portalMaterial ref={portalMaterial} />
            </mesh>

            <Sparkles
                size={6}
                scale={[4, 2, 4]}
                position-y={1}
                speed={0.2}
                count={50}
            />

        </Center>
    </>
}