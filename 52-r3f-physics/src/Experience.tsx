import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Physics, RigidBody, Debug, CuboidCollider, BallCollider, RigidBodyApi, CylinderCollider, InstancedRigidBodies, Vector3Array } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useEffect, useMemo, useRef } from "react";
import { Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from "three";

export default function Experience() {
    const cube = useRef<RigidBodyApi>(null);
    const twister = useRef<RigidBodyApi>(null);
    const model = useGLTF("/hamburger.glb");

    const hitSound = useMemo(() => {
        return new Audio("/hit.mp3");
    }, []);
    console.log(hitSound);

    const cubeJump = () => {
        const mass = cube.current!.mass();
        cube.current?.applyImpulse({ x: 0, y: 5 * mass, z: 0 })
        cube.current?.applyTorqueImpulse({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 })
    }

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const eulerRotation = new Euler(0, time * 3, 0);
        const quaternionRotation = new Quaternion();
        quaternionRotation.setFromEuler(eulerRotation);
        twister.current?.setNextKinematicRotation(quaternionRotation);

        const angle = time * 0.5;
        const x = Math.sin(angle) * 2;
        const z = Math.cos(angle) * 2;
        twister.current?.setNextKinematicTranslation({ x, y: -0.8, z })
    });

    const cubeCollisionHandler = () => {
        // console.log("Collision!!");
        // hitSound.currentTime = 0;
        // hitSound.volume = Math.random();
        // hitSound.play();
    }

    const cubesCount = 300
    const cubes = useRef<InstancedMesh>(null);

    const cubeTransforms = useMemo(() => {
        const positions: Vector3Array[] = []
        const rotations: Vector3Array[] = []
        const scales: Vector3Array[] = []

        for (let i = 0; i < cubesCount; i++) {
            positions.push([ (Math.random() - 0.5) * 8, 6 + i * 0.2, (Math.random() - 0.5) * 8 ])
            rotations.push([ Math.random(), Math.random(), Math.random() ])
    
            const scale = 0.2 + Math.random() * 0.8
            scales.push([ scale, scale, scale ])
        }

        return { positions, rotations, scales }
    }, [])

    // useEffect(() => {
    //     for (let i = 0; i < cubesCount; i++) {
    //         const matrix = new Matrix4()
    //         matrix.compose(
    //             new Vector3(i * 2, 0, 0),
    //             new Quaternion(),
    //             new Vector3(1, 1, 1)
    //         )
    //         cubes.current!.setMatrixAt(i, matrix)
    //     }
    // }, [])


    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <Physics gravity={[0, -9.81, 0]}>
            {/* <Debug /> */}

            <RigidBody colliders="ball" position={[-1.5, 2, 0]} gravityScale={1}>
                <mesh castShadow>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={cube}
                position={[1.5, 2, 0]}
                restitution={1}
                friction={0.7}
                colliders={false}
                onCollisionEnter={cubeCollisionHandler}
            // onSleep={() => console.log("Sleep")}
            // onWake={() => console.log("Wake")}
            // onCollisionExit={() => console.log("EXIT")}
            >
                {/* <mesh castShadow position={[2, 2, 0]}>
                    <boxGeometry args={[3, 2, 1]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh> */}
                <mesh castShadow onClick={cubeJump}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
                {/* <CuboidCollider args={[1.5, 1.5, 0.5]} />
                <CuboidCollider args={ [ 0.25, 1, 0.25 ] } position={ [ 0, 0, 1 ] } rotation={ [ - Math.PI * 0.35, 0, 0 ] } /> */}
                {/* <BallCollider args={ [ 1.5 ] } />
                <mesh castShadow>
                    <torusGeometry args={[1, 0.5, 16, 32]} />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh> */}
                <CuboidCollider mass={2} args={[0.5, 0.5, 0.5]} />
            </RigidBody>

            <RigidBody type="fixed" restitution={0} friction={0.7}>
                <mesh receiveShadow position-y={- 1.25}>
                    <boxGeometry args={[10, 0.5, 10]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            <RigidBody
                ref={twister}
                position={[0, -0.8, 0]}
                friction={0}
                type="kinematicPosition"
            >
                <mesh castShadow scale={[0.4, 0.4, 3]}>
                    <boxGeometry />
                    <meshStandardMaterial color={"red"} />
                </mesh>
            </RigidBody>

            <RigidBody colliders={false} position={[0, 4, 0]}>
                <CylinderCollider args={[0.5, 1.25]} />
                <primitive object={model.scene} scale={0.25} />
            </RigidBody>

            <RigidBody type="fixed">
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, - 5.5]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                <CuboidCollider args={[0.5, 2, 5]} position={[- 5.5, 1, 0]} />
            </RigidBody>

            <InstancedRigidBodies
                positions={ cubeTransforms.positions }
                rotations={ cubeTransforms.rotations }
                scales={ cubeTransforms.scales }
            >
                <instancedMesh ref={cubes} args={[undefined, undefined, cubesCount]}>
                    <boxGeometry />
                    <meshStandardMaterial color="tomato" />
                </instancedMesh>
            </InstancedRigidBodies>
        </Physics>


    </>
}