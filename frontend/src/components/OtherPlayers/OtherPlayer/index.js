import React, { useCallback, useState, useRef, useEffect } from "react"
import { Graphics, Text, useTick } from '@inlet/react-pixi'
import { BASE_SIZE, PLAYER_RADIUS, THIN_LINE_WIDTH } from '../../../settings/constants'
import { drawPlayer } from "../../Player"
import NamePlate from "../NamePlate"

function OtherPlayer(props) {

    const player = props.player
    const lastUpdateTime = props.lastUpdate
    const refreshPositionDelay = 50
    const [x, setX] = useState(player.x)
    const [y, setY] = useState(player.x)

    const [showName, setShowName] = useState(false)

    const ref = useRef(null)

    useTick(delta => {

        if(Date.now() - lastUpdateTime > refreshPositionDelay) return

        let t = (Date.now() - lastUpdateTime) / refreshPositionDelay

        player.x = player.xp + t * (player.xd - player.xp)
        player.y = player.yp + t * (player.yd - player.yp)

        setX(player.x)
        setY(player.y)
    });

    useEffect(() => {
        if(ref.current) {
            ref.current.cursor = 'pointer'
        }
    }, [])

    useEffect(() => {
        const handleClick = () => {
            if (showName) {
                setShowName(false);
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => {
            document.removeEventListener('mousedown', handleClick)
        }
    }, [showName]);

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(0x0033cc, 1)
        g.lineStyle(THIN_LINE_WIDTH,0,1)

        drawPlayer(0, 0, PLAYER_RADIUS, g, 4)
        g.endFill()
    }, []);

    return(
        <>
            <Graphics ref={ref} draw={draw} x={x * BASE_SIZE} y={y * BASE_SIZE} interactive pointerdown={() => setShowName(true)} />
            { showName && <NamePlate name={player.nickname} x={x * BASE_SIZE} y={y * BASE_SIZE} />}
        </>
    )
}

export default OtherPlayer