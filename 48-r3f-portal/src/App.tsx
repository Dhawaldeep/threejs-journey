import { Canvas } from "@react-three/fiber"
import Experience from "./Experience"

function App() {

  return (
    <Canvas
      flat
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [1, 2, 6]
      }}
    >
      <color args={ [ '#030202' ] } attach="background" />
      <Experience />
    </Canvas>
  )
}

export default App
