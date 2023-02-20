import { OrbitControls } from '@react-three/drei'
import { useRef } from "react"
import { SSR, EffectComposer, Vignette, Glitch, Noise, Bloom, DepthOfField } from '@react-three/postprocessing'
import { Perf } from 'r3f-perf'
import { BlendFunction } from "postprocessing"
import { Vector2 } from 'three'
import { useControls } from 'leva';
import Drunk from './Drunk'

export default function Experience() {
    const drunkRef = useRef();

    const ssrProps = useControls('SSR Effect', {
        temporalResolve: true,
        STRETCH_MISSED_RAYS: true,
        USE_MRT: true,
        USE_NORMALMAP: true,
        USE_ROUGHNESSMAP: true,
        ENABLE_JITTERING: true,
        ENABLE_BLUR: true,
        temporalResolveMix: { value: 0.9, min: 0, max: 1 },
        temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
        maxSamples: { value: 0, min: 0, max: 1 },
        resolutionScale: { value: 1, min: 0, max: 1 },
        blurMix: { value: 0.5, min: 0, max: 1 },
        blurKernelSize: { value: 8, min: 0, max: 8 },
        blurSharpness: { value: 0.5, min: 0, max: 1 },
        rayStep: { value: 0.3, min: 0, max: 1 },
        intensity: { value: 1, min: 0, max: 5 },
        maxRoughness: { value: 0.1, min: 0, max: 1 },
        jitter: { value: 0.7, min: 0, max: 5 },
        jitterSpread: { value: 0.45, min: 0, max: 1 },
        jitterRough: { value: 0.1, min: 0, max: 1 },
        roughnessFadeOut: { value: 1, min: 0, max: 1 },
        rayFadeOut: { value: 0, min: 0, max: 1 },
        MAX_STEPS: { value: 20, min: 0, max: 20 },
        NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
        maxDepthDifference: { value: 3, min: 0, max: 10 },
        maxDepth: { value: 1, min: 0, max: 1 },
        thickness: { value: 10, min: 0, max: 10 },
        ior: { value: 1.45, min: 0, max: 2 }
    })

    const drunkProps = useControls('Drunk Effect', {
        frequency: { value: 2, min: 1, max: 20 },
        amplitude: { value: 0.1, min: 0, max: 1 }
    })

    return <>
        <color args={['#ffffff']} attach="background" />

        <EffectComposer multisampling={4}>
            {/* <Vignette
                offset={ 0.3 }
                darkness={ 0.9 }
                blendFunction={ BlendFunction.NORMAL }
            />
            <Glitch
                delay={ new Vector2(0.5, 1) }
                duration={ new Vector2( 0.1, 0.3 ) }
                strength={ new Vector2(0.2, 0.4) }
                mode={ GlitchMode.CONSTANT_MILD }
            />
            <Noise
                premultiply
                blendFunction={ BlendFunction.SOFT_LIGHT }
            />
            <Bloom mipmapBlur intensity={ 0.5 } luminanceThreshold={ 0 } />
            <DepthOfField
                focusDistance={ 0.025 }
                focalLength={ 0.025 }
                bokehScale={ 6 }
            />
            <SSR {...ssrProps} /> */}
            <Drunk
                ref={ drunkRef }
                { ...drunkProps }
                blendFunction={ BlendFunction.DARKEN }
            />
        </EffectComposer>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <mesh castShadow position-x={- 2}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow position-x={2} scale={1.5}>
            <boxGeometry />
            {/* <meshStandardMaterial color="#ffffff" emissive="orange" emissiveIntensity={2} toneMapped={false} /> */}
            {/* <meshBasicMaterial color={[ 1.5, 1, 4 ]} toneMapped={false} /> */}
            <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh receiveShadow position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="#555555" metalness={ 0 } roughness={ 0 } />
        </mesh>

    </>
}

// Post Processing:

// The repository: https://github.com/pmndrs/postprocessing
// The documentation (generated from the code): https://pmndrs.github.io/postprocessing/public/docs/
// A demo page (you can change the effect within the debug UI): https://pmndrs.github.io/postprocessing/public/demo/


// React-postprocessing:

// The repository: https://github.com/pmndrs/reactpostprocessing
// The list of effects implemented from postprocessing to React postprocessing: https://github.com/pmndrs/react-postprocessing/blob/master/api.md
// The documentation (very similar to the repo, but more user-friendly): https://docs.pmnd.rs/react-postprocessing/introduction