import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Graphics, useTick } from '@pixi/react'
import { BASE_SIZE, PLAYER_RADIUS, THIN_LINE_WIDTH } from '../../../settings/constants'
import { drawPlayer } from '../../Player'
import NamePlate from '../NamePlate'
import * as PIXI from 'pixi.js'

function OtherPlayer(props) {

    const player = props.player
    const visibility = props.visibility
    const refreshPositionDelay = props.refreshDelay
    const lastUpdateTime = props.lastUpdateTime
    const showNameForce = props.showName
    const [x, setX] = useState(player.x)
    const [y, setY] = useState(player.y)
    const [xP, setXP] = useState(player.x)
    const [yP, setYP] = useState(player.y)
    const [xD, setXD] = useState(player.x)
    const [yD, setYD] = useState(player.y)

    const [showName, setShowName] = useState(false)

    const ref = useRef(null)

    useEffect(() => {
        setXP(player.xp)
        setYP(player.yp)
        setXD(player.xd)
        setYD(player.yd)
    }, [lastUpdateTime])

    useTick(() => {

        let t = (Date.now() - lastUpdateTime) / refreshPositionDelay 
        t = t > 1 ? 1 : t

        player.x = xP + t * (xD - xP)
        player.y = yP + t * (yD - yP)

        setX(player.x)
        setY(player.y)
    })

    useEffect(() => {
        if(ref.current) {
            ref.current.cursor = 'pointer'
        }
    }, [])

    useEffect(() => {
        const handleClick = () => {
            if (showName) {
                setShowName(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [showName])

    const handleClick = (event) => {
        event.stopPropagation()
        setShowName(true)
    }

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(new PIXI.Color(player.color).toNumber(), 1)
        g.lineStyle({width: THIN_LINE_WIDTH, color: 0, alpha: 1, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.ROUND})

        if(visibility === 'normal') drawPlayer(0, 0, PLAYER_RADIUS, g, player.nSides)
        else drawPlayer(0, 0, PLAYER_RADIUS, g, 1)
        g.endFill()
    }, [player, visibility])

    return(
        <>
            <Graphics ref={ref} draw={draw} x={x * BASE_SIZE} y={y * BASE_SIZE} interactive pointerdown={handleClick} />
            { (showName||showNameForce) && <NamePlate name={player.nickname} x={x * BASE_SIZE} y={y * BASE_SIZE} />}
        </>
    )
}

export default OtherPlayer