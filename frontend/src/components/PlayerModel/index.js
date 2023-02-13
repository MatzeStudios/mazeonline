import React, { useCallback } from "react"
import { utils } from "pixi.js"
import { Stage, Graphics } from "@inlet/react-pixi"
import { BASE_SIZE, PLAYER_RADIUS, THIN_LINE_WIDTH } from "../../settings/constants"
import * as PIXI from "pixi.js"

import { drawPlayer } from "../Player" 

function PlayerModel(props) {

    const color = props.player.color
    const nSides = props.player.nSides
    const sizeM = props.sizeMultiplier

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(utils.string2hex(color), 1)
        g.lineStyle({width: THIN_LINE_WIDTH * sizeM, color: 0, alpha: 1, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.ROUND})
        drawPlayer(0, 0, PLAYER_RADIUS * sizeM, g, nSides)
        g.endFill()
    }, [])

    return(
        <Stage 
            width={BASE_SIZE * sizeM}
            height={BASE_SIZE * sizeM}
            options={{
                antialias: false,
                autoDensity: true,
                backgroundColor: 0x3d3d3d}} >
            <Graphics draw={draw} x={(BASE_SIZE * sizeM)/2} y={(BASE_SIZE * sizeM)/2} />
        </Stage>
    )
}

export default PlayerModel