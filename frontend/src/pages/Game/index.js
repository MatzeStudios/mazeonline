import React, { useEffect, useState, useCallback } from 'react'
import {useNavigate} from 'react-router-dom'
import socket from "../../services/socket"

import './style.css'

import GameScreen from '../../components/GameScreen'
import Counter from '../../components/Counter'
import SoundManager from '../../components/SoundManager'

function Game() {
    const [gameInfoReceived, setGameInfoReceived] = useState(false)

    const [startTime, setStartTime] = useState(undefined)
    const [gameState, setGameState] = useState(undefined)
    const [maze, setMaze] = useState(undefined)
    const [playerColor, setPlayerColor] = useState(undefined)
    const [playerId, setPlayerId] = useState(undefined)

    const navigate = useNavigate()
    const handleRedirectHome = useCallback(() => {
        navigate('/', {replace: true})
    }, [navigate])

    useEffect(() => {
        socket.emit("getGameInfo")

        socket.on("gameInfo", data => {
            if(!data) {
                handleRedirectHome() // Player doesn't exist in server.
                return
            }
            if(gameInfoReceived) return // Already set info.

            setMaze(data.maze)
            setPlayerColor(data.player.color)
            setPlayerId(data.player.id)

            setGameState(data.state)
            
            if(data.state === 'starting') setStartTime(data.startTime)
            else setStartTime(0)

            setGameInfoReceived(true)
        })
    }, [])

    useEffect(() => {
        const content = document.querySelector('html')
        content.style.overflow = 'hidden'

        return () => {
            content.style.overflow = 'visible'
        }
    }, [])

    if(gameInfoReceived) return (
        <>
            <SoundManager />
            <Counter time={startTime} />
            <GameScreen state={gameState} freeze={startTime} maze={maze} color={playerColor} playerId={playerId} />
        </>
    )

    else return <p className='loading-container'>Loading...</p>
}

export default Game