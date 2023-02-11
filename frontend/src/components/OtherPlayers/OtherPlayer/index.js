import React, { useCallback, useState, useRef, useEffect } from "react"
import { Graphics, useTick } from "@inlet/react-pixi"
import { BASE_SIZE, PLAYER_RADIUS, THIN_LINE_WIDTH } from "../../../settings/constants"
import { drawPlayer } from "../../Player"
import NamePlate from "../NamePlate"
import { utils } from "pixi.js"
import * as PIXI from "pixi.js"

function OtherPlayer(props) {

    const player = props.player
    const lastUpdateTime = props.lastUpdate
    const visibility = props.visibility
    const refreshPositionDelay = 50 * 1.5
    const [x, setX] = useState(player.x)
    const [y, setY] = useState(player.x)

    const [showName, setShowName] = useState(false)

    const ref = useRef(null)

    useTick(() => {

        if(Date.now() - lastUpdateTime > refreshPositionDelay) return

        let t = (Date.now() - lastUpdateTime) / refreshPositionDelay

        player.x = player.xp + t * (player.xd - player.xp)
        player.y = player.yp + t * (player.yd - player.yp)

        setX(player.x)
        setY(player.y)
    })

    useEffect(() => {
        if(ref.current) {
            ref.current.cursor = "pointer"
        }
    }, [])

    useEffect(() => {
        const handleClick = () => {
            if (showName) {
                setShowName(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    }, [showName])

    const handleClick = (event) => {
        event.stopPropagation()
        setShowName(true)
    }

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(utils.string2hex(player.color), 1)
        g.lineStyle({width: THIN_LINE_WIDTH, color: 0, alpha: 1, cap: PIXI.LINE_CAP.ROUND, join: PIXI.LINE_JOIN.ROUND})

        if(visibility === "normal") drawPlayer(0, 0, PLAYER_RADIUS, g, player.nSides)
        else drawPlayer(0, 0, PLAYER_RADIUS, g, 1)
        g.endFill()
    }, [player, visibility])

    return(
        <>
            <Graphics ref={ref} draw={draw} x={x * BASE_SIZE} y={y * BASE_SIZE} interactive pointerdown={handleClick} />
            { showName && <NamePlate name={player.nickname} x={x * BASE_SIZE} y={y * BASE_SIZE} />}
        </>
    )
}

export default OtherPlayer