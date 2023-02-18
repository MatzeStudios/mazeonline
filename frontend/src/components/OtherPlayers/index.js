import React, { useState, useEffect, useRef } from 'react'
import socket from '../../services/socket'
import OtherPlayer from './OtherPlayer'
import useEventListener from '@use-it/event-listener'

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
    const refreshDelay = props.refreshDelay

    const [lastUpdateTime, setLastUpdateTime] = useState(0)
    const [spacebarHeld, setSpacebarHeld] = useState(false)

    const players = useState([])[0]

    const updatePositionsRef = useRef()

    useEventListener('keydown', (event) => {
        if(event.code.toLowerCase() === 'space') setSpacebarHeld(true)
    })
    
    useEventListener('keyup', (event) => {
        if(event.code.toLowerCase() === 'space') setSpacebarHeld(false)
    })

    useEffect(() => {
        const deactivatePresses = () => {
            setSpacebarHeld(false)
        }

        window.addEventListener('blur', deactivatePresses)
        return () => {
            window.removeEventListener('blur', deactivatePresses)
        }
    }, [])

    useEffect(() => {
        updatePositionsRef.current = (data) => {
            for(let i = 0; i < data.length; i++) {
                let pd = data[i]
                if(pd.id === id) continue
    
                let j = findById(players, pd.id)
    
                if(j === -1) { // player not recognized
                    continue
                }
    
                let pp = players[j]
                
                if(visibility === 'none') {
                    pp.x = pd.x
                    pp.y = pd.y
                }
                pp.xp = pp.x
                pp.yp = pp.y
                pp.xd = pd.x
                pp.yd = pd.y
            }
            setLastUpdateTime(Date.now())
        }
    }, [visibility])

    useEffect(() => {
        for(let i=0; i<initialPlayers.length; i++) {
            let player = initialPlayers[i]
            if(player.id === id) continue
            player.xp = player.x
            player.yp = player.y
            player.xd = player.x
            player.yd = player.y
            players.push(player)
        }
    },[])

    useEffect(() => {
        
        const updatePos = (data) => updatePositionsRef.current(data)
        
        const playerDisconnected = id => {
            let i = findById(players, id)
            if(i === -1) return
            players.splice(i, 1)
        }

        const playerConnected = player => {
            if(player.id === id) return
            player.xp = player.x
            player.yp = player.y
            player.xd = player.x
            player.yd = player.y
            players.push(player)
        }

        const playerInfo = (player) => {
            let i = findById(players, player.id)
            if(i !== -1) return
            player.xp = player.x
            player.yp = player.y
            player.xd = player.x
            player.yd = player.y
            players.push(player)
        }

        socket.on('positions', updatePos)
        socket.on('playerDisconnected', playerDisconnected)
        socket.on('playerConnected', playerConnected)
        socket.on('playerInfo', playerInfo)

        return () => {
            socket.off('positions', updatePos)
            socket.off('playerDisconnected', playerDisconnected)
            socket.off('playerConnected', playerConnected)
            socket.off('playerInfo', playerInfo)
        }
    }, [])

    if(visibility === 'none') return null
    return(
        <>
            {players.map((item) => {
                return <OtherPlayer player={item} key={item.id} visibility={visibility} refreshDelay={refreshDelay} lastUpdateTime={lastUpdateTime} showName={spacebarHeld}/>
            })}
        </>
    )
}

export default OtherPlayers