import React, { useState, useCallback, useEffect, useRef } from "react"
import { Graphics, useTick } from '@inlet/react-pixi'
import { BASE_SIZE, PLAYER_RADIUS } from '../../settings/constants'
import socket from "../../services/socket"
import { drawPlayer } from "../Player"

const findById = (players, id) => {
    for(let i = 0; i < players.length; i++) {
        if(players[i].id === id) return i
    }
    return -1
}

function OtherPlayers(props) {
    
    const [players, setPlayers] = useState([])
    const [id, setId] = useState()
    const [forceRedraw, setForceRedraw] = useState(false)

    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    const [xp, setXP] = useState(0)
    const [yp, setYP] = useState(0)

    const [xd, setXD] = useState(0)
    const [yd, setYD] = useState(0)

    const [lastUpdateTime, setLastUpdateTime] = useState(0)
    const refreshPositionDelay = 50
    
    useEffect(() => {
        socket.emit("getId")
        socket.on("getId", data => {
            setId(data)
        })
    }, []);

    useEffect(() => {
        socket.on("positions", (data) => {
            for(let i = 0; i < data.length; i++) {
                let pd = data[i]
                let j = findById(players, pd.id)
                if(j != -1) { // already exists
                    let pp = players[j]
                    pp.xp = pp.x
                    pp.yp = pp.y
                    pp.xd = pd.x
                    pp.yd = pd.y
                }
                else { // new player
                    pd.xp = pd.x
                    pd.yp = pd.y
                    pd.xd = pd.x
                    pd.yd = pd.y
                    players.push(pd)
                }
            }
            setLastUpdateTime(Date.now())
        })

        socket.on('playerDisconnected', id => {
            let i = findById(players, id)
            if(i === -1) return
            players.splice(i, 1)
        })
    }, []);

    useTick(delta => {

        if(Date.now() - lastUpdateTime > refreshPositionDelay) return

        let t = (Date.now() - lastUpdateTime) / refreshPositionDelay

        for(let i=0; i<players.length; i++) {
            let player = players[i]
            player.x = player.xp + t * (player.xd - player.xp)
            player.y = player.yp + t * (player.yd - player.yp)
        }

        setForceRedraw(c => !c)
    })

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(0x0033cc, 1)
        g.lineStyle(2,0,1)

        for(let i=0; i<players.length; i++) {
            let player = players[i]
            if(player.id !== id) drawPlayer(player.x*BASE_SIZE, player.y*BASE_SIZE, PLAYER_RADIUS, g, 4)
        }

        g.endFill()
    }, [players, forceRedraw, id]);

    return(
        <Graphics draw={draw} />
    )
}

export default OtherPlayers