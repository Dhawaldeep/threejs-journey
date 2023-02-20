import DrunkEffect from "./DrunkEffect"
import { BlendFunction } from "postprocessing"
import { forwardRef } from "react"

export default forwardRef(function Drunk(props: {frequency: number; blendFunction: BlendFunction; amplitude: number;})
{
    const effect = new DrunkEffect(props);
    return <primitive object={ effect } />
})