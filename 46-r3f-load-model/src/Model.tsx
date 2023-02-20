import { Clone, useGLTF } from '@react-three/drei'

export default function Model(props: { scale: number; }) {
    // const model =  useLoader(GLTFLoader, "/hamburger-draco.glb", (loader) => {
    //     const dracoLoader = new DRACOLoader();
    //     dracoLoader.setDecoderPath("/draco/");
    //     loader.setDRACOLoader(dracoLoader);
    // });

    const model = useGLTF("/hamburger.glb");

    return <>
    {/* <primitive {...props} object={model.scene} />; */}
        <Clone object={model.scene} position-x={-4} />
        <Clone object={model.scene} position-x={0} />
        <Clone object={model.scene} position-x={4} />
    </>  
}

// useGLTF.preload('./hamburger-draco.glb')
