import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from "../../services/socket"

// styles
import './index.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'


function End() {

    const [endInfoReceived, setEndInfoReceived] = useState(false)

    const [finishers, setFinishers] = useState()

    const navigate = useNavigate()

    const handleRedirectHome = useCallback(() => {
        navigate('/', {replace: true})
    }, [navigate])

    const handleRedirectGame = useCallback(() => {
        navigate('/game', {replace: true})
    }, [navigate])

    useEffect(() => {
        socket.emit("getEndInfo")

        socket.on("endInfo", data => {
            if(endInfoReceived) return // Already set info.
            if(!data) {
                handleRedirectHome()
                return
            }

            setFinishers(data.finishers)

            setEndInfoReceived(true)
        })

        socket.on("nextGame", handleRedirectGame)

    }, [])
    

    if(endInfoReceived) return (
        <>
            <ul>
            {finishers.map((player, index) => (
                <li key={player.nickname}>
                {index + 1}. {player.nickname}
                </li>
            ))}
            </ul>
        </>
    )

    else return <p className='loading-container'>Loading...</p>
}

export default End