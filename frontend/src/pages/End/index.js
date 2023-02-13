import React, { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import socket from "../../services/socket"

// styles
import "./index.css"

//fonts 
import "../../fonts/Bungee_Shade/BungeeShade-Regular.ttf"
import "../../fonts/Inter/static/Inter-Regular.ttf"
import PlayerModel from "../../components/PlayerModel"

const finishTimeToString = (ms) => {
    let t = ms/1000
    return Math.floor(t / 60) + ":" + (t % 60).toFixed(2)
}

function End() {

    const [endInfoReceived, setEndInfoReceived] = useState(false)

    const [finishers, setFinishers] = useState()

    const navigate = useNavigate()

    const handleRedirectHome = useCallback(() => {
        navigate("/", {replace: true})
    }, [navigate])

    const handleRedirectGame = useCallback(() => {
        navigate("/game", {replace: true})
    }, [navigate])

    useEffect(() => {
        socket.emit("getEndInfo")

        const getInfo = data => {
            if(endInfoReceived) return // Already set info.
            if(!data) {
                handleRedirectHome()
                return
            }

            setFinishers(data.finishers)

            setEndInfoReceived(true)
        }

        socket.on("endInfo", getInfo)
        socket.on("nextGame", handleRedirectGame)

        return () => {
            socket.off("endInfo", getInfo)
            socket.off("nextGame", handleRedirectGame)
        }
    }, [])
    

    if(endInfoReceived) return (
        <>
            <ul>
                {finishers.map((player, index) => (
                    <li key={player.id}>
                        Posição: {index + 1} / Nome: {player.nickname} / Tempo: {finishTimeToString(player.finishTime) } / Modelo: <PlayerModel player={player} sizeMultiplier={1} />
                    </li>
                ))}
            </ul>
        </>
    )

    else return <p className='loading-container'>Loading...</p>
}

export default End