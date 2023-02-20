import { useRef, useEffect, useState } from 'react'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useRapier, RigidBody, RigidBodyApi } from '@react-three/rapier'
import useGame from './stores/useGame'

export default function Player() {
    const body = useRef<RigidBodyApi>(null);
    const [subscribeKeys, getKeys] = useKeyboardControls();
    const { rapier, world } = useRapier();
    const rapierWorld = world.raw();

    const start = useGame((state: any) => state.start)
    const end = useGame((state: any) => state.end)
    const blocksCount = useGame((state: any) => state.blocksCount)
    const restart = useGame((state: any) => state.restart)

    const [smoothedCameraPosition] = useState(() => new Vector3(10, 10, 10));
    const [smoothedCameraTarget] = useState(() => new Vector3());

    const jump = () => {
        const origin = body.current!.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: - 1, z: 0 };
        const ray = new rapier.Ray(origin, direction);
        const hit = rapierWorld.castRay(ray, 10, true);

        if (hit && hit.toi < 0.15)
            body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 })

    }

    const reset = () => {
        body.current?.setTranslation({ x: 0, y: 1, z: 0 });
        body.current?.setLinvel({ x: 0, y: 0, z: 0 });
        body.current?.setAngvel({ x: 0, y: 0, z: 0 });
    }

    useEffect(() => {
        const unsubscribeJump = subscribeKeys(
            (state: any) => state.jump,
            (value) => {
                if (value)
                    jump();
            }
        );

        const unsubscribeAny = subscribeKeys(
            () => {
                start();
            }
        );

        const unsubscribeReset = useGame.subscribe(
            (state: any) => state.phase,
            (value) => {
                if (value === 'ready')
                    reset()
            }
        )

        return () => {
            unsubscribeJump();
            unsubscribeAny();
            unsubscribeReset();
        }
    }, []);

    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward } = getKeys();
        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };

        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        }

        if (rightward) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }

        if (leftward) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }

        body.current?.applyImpulse(impulse);
        body.current?.applyTorqueImpulse(torque);


        const bodyPosition = body.current!.translation();

        const cameraPosition = new Vector3();
        cameraPosition.copy(bodyPosition);
        cameraPosition.z += 2.25;
        cameraPosition.y += 0.65;

        const cameraTarget = new Vector3();
        cameraTarget.copy(bodyPosition);
        cameraTarget.y += 0.25;

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

        state.camera.position.copy(smoothedCameraPosition);
        state.camera.lookAt(smoothedCameraTarget);

        /**
        * Phases
        */
        if (bodyPosition.z < - (blocksCount * 4 + 2))
            end();

        if (bodyPosition.y < - 4)
            restart();
    })

    return <RigidBody
        ref={body}
        colliders="ball"
        restitution={0.2}
        friction={1}
        position={[0, 1, 0]}
        linearDamping={0.5}
        angularDamping={0.5}
    >
        <mesh castShadow>
            <icosahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
    </RigidBody>
}