import React, { useState, useCallback, useEffect, useInsertionEffect } from "react"
import { Graphics } from '@inlet/react-pixi'
import { BASE_SIZE } from '../../settings/constants'
import socket from "../../services/socket"

function OtherPlayers() {
    
    const [players, setPlayers] = useState([])
    const [id, setId] = useState()

    const radius = BASE_SIZE / 5;

    useEffect(() => {
        socket.emit("getId")
        socket.on("getId", data => {
            setId(data)
        })
    }, []);

    useEffect(() => {
        socket.on("positions", data => {
            setPlayers(data)
        });
    }, []);

    const draw = useCallback(g => {
        
        g.clear()
        g.beginFill(0x0033cc, 1)
        g.lineStyle(2,0,1)

        for(let player in players) {
            player = players[player]
            if(player.id != id) g.drawRect(player.x*BASE_SIZE-radius, player.y*BASE_SIZE-radius, radius*2, radius*2)
        }

        g.endFill()
    }, [players]);

    return(
        <Graphics draw={draw} />
    )
}

export default OtherPlayers