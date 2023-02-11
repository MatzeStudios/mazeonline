import React, { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import socket from "../../services/socket"

import "./style.css"

import GameScreen from "../../components/GameScreen"
import StartCounter from "../../components/StartCounter"
import EndCounter from "../../components/EndCounter"
import Pause from "../../components/Pause"
// import SoundManager from "../../components/SoundManager"

function Game() {
    const [gameInfoReceived, setGameInfoReceived] = useState(false)

    const [startTime, setStartTime] = useState(undefined)
    const [gameState, setGameState] = useState(undefined)
    const [maze, setMaze] = useState(undefined)
    const [playerColor, setPlayerColor] = useState(undefined)
    const [playerId, setPlayerId] = useState(undefined)
    const [playerNSides, setPlayerNSides] = useState(undefined)
    const [players, setPlayers] = useState(undefined)

    const [endTime, setEndTime] = useState(undefined)

    const [otherPlayersVisibility, setOtherPlayersVisibility] = useState("normal") // normal, restricted, none

    const navigate = useNavigate()

    const handleRedirectHome = useCallback(() => {
        navigate("/", {replace: true})
    }, [navigate])
    
    const handleRedirectEnd = useCallback(() => {
        navigate("/end", {replace: true})
    }, [navigate])

    useEffect(() => {
        socket.emit("getGameInfo")

        const processGameInfo = data => {
            if(gameInfoReceived) return // Already set info.
            
            if(!data) {
                handleRedirectHome() // Player doesn't exist in server.
                return
            }
            if(data.state === "end") {
                handleRedirectEnd()
                return
            }

            setMaze(data.maze)
            setPlayerColor(data.player.color)
            setPlayerId(data.player.id)
            setPlayerNSides(data.player.nSides)
            setPlayers(data.players)

            setGameState(data.state)
            
            if(data.state === "starting") setStartTime(data.startTime)
            else setStartTime(0)
            
            if(data.state === "finishing") setEndTime(data.endTime)

            setGameInfoReceived(true)
        }

        const processCancelFinish = () => setEndTime(undefined)

        socket.on("gameInfo", processGameInfo)
        socket.on("gameFinishing", setEndTime)
        socket.on("gameEnd", handleRedirectEnd)
        socket.on("cancelFinish", processCancelFinish)
        
        return () => {
            socket.off("gameInfo", processGameInfo)
            socket.off("gameFinishing", setEndTime)
            socket.off("gameEnd", handleRedirectEnd)
            socket.off("cancelFinish", processCancelFinish)
        }
    }, [])

    useEffect(() => {
        const content = document.querySelector("html")
        content.style.overflow = "hidden"

        return () => {
            content.style.overflow = "visible"
        }
    }, [])

    if(gameInfoReceived) return (
        <>
            {/* <SoundManager /> */}
            <Pause setOtherPlayersVisibility={setOtherPlayersVisibility} />
            <StartCounter time={startTime} />
            { endTime && <EndCounter time={endTime} /> }
            <GameScreen state={gameState} freeze={startTime} maze={maze} color={playerColor} playerId={playerId} playerNSides={playerNSides} otherPlayersVisibility={otherPlayersVisibility} players={players} />
        </>
    )

    else return <p className='loading-container'>Loading...</p>
}

export default Game