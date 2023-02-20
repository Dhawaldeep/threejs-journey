// import { OrbitControls } from '@react-three/drei'
import { Debug, Physics } from '@react-three/rapier'
import Effects from './Effects';
import Level from './Level'
import Lights from './Lights'
import Player from './Player'
import useGame from './stores/useGame';

export default function Experience()
{
    const blocksCount = useGame((state: any) => state.blocksCount);
    const blocksSeed = useGame((state: any) => state.blocksSeed);
    return <Physics>

        {/* <OrbitControls makeDefault /> */}
        <color args={ [ '#252731' ] } attach="background" />

        {/* <Debug /> */}

        <Lights />

        <Level count={blocksCount} seed={blocksSeed} />

        <Player />

        {/* <Effects /> */}

    </Physics>
}