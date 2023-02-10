import React, { useState, useEffect } from "react"
import socket from "../../services/socket"
import OtherPlayer from "./OtherPlayer"

const findById = (players, id) => {
    for(let i = 0; i < players.length; i++) {
        if(players[i].id === id) return i
    }
    return -1
}

function OtherPlayers(props) {
    
    const id = props.playerId
    const visibility = props.visibility

    const players = useState([])[0]

    const [lastUpdateTime, setLastUpdateTime] = useState(0)

    useEffect(() => {
        const positions = (data) => {
            for(let i = 0; i < data.length; i++) {
                let pd = data[i]
                let j = findById(players, pd.id)
                if(j !== -1) { // already exists
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
        }

        const playerDisconnected = id => {
            let i = findById(players, id)
            if(i === -1) return
            players.splice(i, 1)
        }

        socket.on("positions", positions)
        socket.on('playerDisconnected', playerDisconnected)

        return () => {
            socket.off("positions", positions)
            socket.off('playerDisconnected', playerDisconnected)
        }

    }, []);

    if(visibility === 'none') return null
    return(
        <>
            {players.map((item, index) => {
                if(item.id === id) return null;
                return <OtherPlayer lastUpdate={lastUpdateTime} player={item} key={item.id} visibility={visibility}/>
            })}
        </>
    );
}

export default OtherPlayers