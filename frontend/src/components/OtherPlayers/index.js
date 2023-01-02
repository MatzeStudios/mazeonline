import React, { useState, useCallback } from "react"
import { Graphics } from '@inlet/react-pixi'
import { BASE_SIZE } from '../../settings/constants'

function OtherPlayers(props) {

    const socket = props.socket

    const [players, setPlayers] = useState([])

    const radius = BASE_SIZE / 5;

    socket.on("positions", data => {
        setPlayers(data)
    });

    const draw = useCallback(g => {
        
        g.clear()
        g.beginFill(0x0033cc, 1)
        g.lineStyle(2,0,1)

        for(let player in players) {
            player = players[player]
            g.drawRect(player.x*BASE_SIZE-radius, player.y*BASE_SIZE-radius, radius*2, radius*2)
        }

        g.endFill()
    }, [players]);

    return(
        <Graphics draw={draw} />
    )
}

export default OtherPlayers