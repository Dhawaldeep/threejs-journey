import { MutableRefObject, useRef } from "react";
import { Environment, AccumulativeShadows, RandomizedLight, BakeShadows, OrbitControls, softShadows, useHelper, ContactShadows, Sky, Lightformer, Stage } from "@react-three/drei";
import { DirectionalLight, DirectionalLightHelper, Mesh } from "three";
import { useControls } from "leva";
import { Perf } from 'r3f-perf'
import { useFrame } from "@react-three/fiber";

// softShadows({
//     frustum: 3.75,
//     size: 0.005,
//     near: 9.5,
//     samples: 17,
//     rings: 11
// })

export default function Experience() {
    const cubeRef = useRef<Mesh | null>(null);
    const sphereRef = useRef<Mesh | null>(null);
    const directionalLight = useRef<DirectionalLight>(null);

    const { color, opacity, blur } = useControls("Contact Shadows", {
        color: '#1d8f75',
        opacity: { value: 0.4, min: 0, max: 1 },
        blur: { value: 2.8, min: 0, max: 10 },
    });

    // const { sunPosition } = useControls("Sky", {
    //     sunPosition: {
    //         value: [1, 2, 3]
    //     }
    // });

    const { envMapIntensity, envMapHeight, envMapRadius, envMapScale } = useControls('environment map', {
        envMapIntensity: { value: 3.5, min: 0, max: 12 },
        envMapHeight: { value: 7, min: 0, max: 100 },
        envMapRadius: { value: 28, min: 10, max: 1000 },
        envMapScale: { value: 100, min: 10, max: 1000 }
    })

    useHelper(directionalLight as MutableRefObject<DirectionalLight>, DirectionalLightHelper, 1);

    useFrame((_, delta) => {
        // const time = state.clock.elapsedTime
        // cubeRef.current!.position.x = 2 + Math.sin(time)
        cubeRef.current!.rotation.y += delta * 0.2;
    });
    return (
        <>
            <Perf position="top-left" />
            {/* <BakeShadows /> */}

            {/* <AccumulativeShadows
                position={ [ 0, - 0.99, 0 ] }
                scale={ 10 }
                color="#316d39"
                opacity={ 0.8 }
                frames={ Infinity }
                temporal
                blend={100}
            >
                <RandomizedLight
                    amount={ 8 }
                    radius={ 1 }
                    ambient={ 0.5 }
                    intensity={ 1 }
                    position={ [ 1, 2, 3 ] }
                    bias={ 0.001 }
                />
            </AccumulativeShadows> */}

            <ContactShadows
                position={[0, 0, 0]}
                scale={10}
                resolution={512}
                far={5}
                color={color}
                opacity={opacity}
                blur={blur}
                frames={1}
            />

            {/* <Sky sunPosition={sunPosition} /> */}

            <color args={["ivory"]} attach="background" />

            <OrbitControls makeDefault />

            {/* <directionalLight
                ref={directionalLight}
                position={sunPosition}
                intensity={1.5}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={5}
                shadow-camera-right={5}
                shadow-camera-bottom={-5}
                shadow-camera-left={-5}
            />
            <ambientLight intensity={0.5} /> */}

            {/* <Environment
                background
            // files={[
            //     "./environmentMaps/0/px.jpg",
            //     "./environmentMaps/0/nx.jpg",
            //     "./environmentMaps/0/py.jpg",
            //     "./environmentMaps/0/nx.jpg",
            //     "./environmentMaps/0/pz.jpg",
            //     "./environmentMaps/0/nz.jpg",
            // ]}
            // files={"./environmentMaps/the_sky_is_on_fire_2k.hdr"}
                preset="sunset"
                // resolution={ 32 }
                ground={ {
                    height: envMapHeight,
                    radius: envMapRadius,
                    scale: envMapScale
                } }
            > */}
            {/* <color args={ [ '#000000' ] } attach="background" /> */}
            {/*<mesh position-z={-5} scale={10}>
                    <planeGeometry />
                    <meshBasicMaterial color={[10, 0, 0]} />
                </mesh> */}
            {/* <Lightformer
                    position-z={-5}
                    scale={10}
                    color="red"
                    intensity={10}
                    form={"ring"}
                /> */}
            {/* </Environment> */}


            <Stage
                shadows={{
                    type: "contact",
                    opacity: 0.2,
                    blur: 3
                }}
                environment="sunset"
                preset="portrait"
                intensity={2}
            >
                <mesh castShadow ref={sphereRef} position={[-2, 1, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial envMapIntensity={envMapIntensity} color={"orange"} />
                </mesh>
                <mesh castShadow ref={cubeRef} position-y={1} position-x={2} scale={1.5}>
                    <boxGeometry />
                    <meshStandardMaterial envMapIntensity={envMapIntensity} color="mediumpurple" />
                </mesh>
            </Stage>

            {/* <mesh castShadow ref={sphereRef} position={[-2, 1, 0]}>
                <sphereGeometry />
                <meshStandardMaterial envMapIntensity={envMapIntensity} color={"orange"} />
            </mesh>


            <mesh castShadow ref={cubeRef} position-y={1} position-x={2} scale={1.5}>
                <boxGeometry />
                <meshStandardMaterial envMapIntensity={envMapIntensity} color="mediumpurple" />
            </mesh> */}

            {/* <mesh position-y={0} rotation-x={- Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial envMapIntensity={envMapIntensity} color="greenyellow" />
            </mesh> */}
        </>
    )
}

