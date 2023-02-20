export default function Placeholder(props: { 'position-y': number; scale: [x: number, y: number, z: number]; }) {
    return (
        <mesh {...props}>
            <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
            <meshBasicMaterial color={"red"} wireframe />
        </mesh>
    )
}