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
    const initialPlayers = props.players

    const players = useState([])[0]

    const [lastUpdateTime, setLastUpdateTime] = useState(0)

    useEffect(() => {
        for(let i=0; i<initialPlayers.length; i++) {
            let player = initialPlayers[i];
            player.xp = player.x;
            player.yp = player.y;
            player.xd = player.x;
            player.yd = player.y;
            players.push(player);
        }
    },[])

    useEffect(() => {
        const positions = (data) => {
            for(let i = 0; i < data.length; i++) {
                let pd = data[i]
                if(pd.id === id) continue;

                let j = findById(players, pd.id)

                if(j === -1) { // player not recognized
                    continue;
                }

                let pp = players[j]
                pp.xp = pp.x
                pp.yp = pp.y
                pp.xd = pd.x
                pp.yd = pd.y
                
            }
            setLastUpdateTime(Date.now())
        }

        const playerDisconnected = id => {
            let i = findById(players, id)
            if(i === -1) return
            players.splice(i, 1)
        }

        const playerConnected = player => {
            if(player.id === id) return;
            player.xp = player.x;
            player.yp = player.y;
            player.xd = player.x;
            player.yd = player.y;
            players.push(player);
        }

        const playerInfo = (player) => {
            let i = findById(players, player.id);
            if(i !== -1) return;
            player.xp = player.x;
            player.yp = player.y;
            player.xd = player.x;
            player.yd = player.y;
            players.push(player);
        }

        socket.on("positions", positions)
        socket.on('playerDisconnected', playerDisconnected)
        socket.on('playerConnected', playerConnected)
        socket.on('playerInfo', playerInfo)

        return () => {
            socket.off("positions", positions)
            socket.off('playerDisconnected', playerDisconnected)
            socket.off('playerConnected', playerConnected)
            socket.off('playerInfo', playerInfo)
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