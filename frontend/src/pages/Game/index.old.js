import React from "react"
import { Stage } from '@inlet/react-pixi'

import Player from "../../components/Player"

function Game() {

    return (

        <Stage
        width={700}
        height={700}
        options={{
            backgroundColor: 0,
            antialias: true,
            autoDensity: true
        }}>

            <Player />

        </Stage>
    )
}

export default Game