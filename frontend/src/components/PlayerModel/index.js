import React, { useCallback, useEffect, useRef } from 'react'
import { Stage, Graphics } from '@pixi/react'
import { PLAYER_RADIUS, THIN_LINE_WIDTH } from '../../settings/constants'
import * as PIXI from 'pixi.js'

import { drawPlayer } from '../Player' 

function PlayerModel(props) {

    const color = props.player.color
    const nSides = props.player.nSides
    const sizeM = 6

    const appRef = useRef()

    useEffect(() => {
        appRef.current.app.renderer.view.classList.add('player-model')
    }, [])

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(new PIXI.Color(color).toNumber(), 1)
        g.lineStyle({width: THIN_LINE_WIDTH * sizeM, color: 0, alpha: 1, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.ROUND})
        drawPlayer(0, 0, PLAYER_RADIUS * sizeM, g, nSides)
        g.endFill()
    }, [])

    return(
        <Stage 
            width={PLAYER_RADIUS * sizeM * 2 + THIN_LINE_WIDTH*sizeM}
            height={PLAYER_RADIUS * sizeM * 2 + THIN_LINE_WIDTH*sizeM}
            options={{
                antialias: false,
                autoDensity: true,
                backgroundAlpha: 0}}
            ref={appRef} >
            <Graphics draw={draw} x={(PLAYER_RADIUS * sizeM * 2 + THIN_LINE_WIDTH*sizeM)/2} y={(PLAYER_RADIUS * sizeM * 2 + THIN_LINE_WIDTH*sizeM)/2} />
        </Stage>
    )
}

export default PlayerModel