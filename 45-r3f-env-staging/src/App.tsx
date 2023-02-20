import './App.css'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import { SoftShadows } from '@react-three/drei'
// import { useMemo } from 'react'
// import { Color } from 'three'

function App() {
  // const created = useMemo(() => {
  //   return ({scene}: RootState) => {
  //     // gl.setClearColor("red");
  //     scene.background = new Color("red");
  //   }
  // }, [])
  return (
    <>
      <Canvas
        shadows = {false}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [- 4, 3, 6]
        }}
      // onCreated={created}
      >/
        <Experience />
      </Canvas>
    </>
  )
}

export default App
