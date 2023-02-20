import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../../services/socket'

// styles
import './index.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'
import FinishersList from '../../components/FinishersList'
import MapOptions from '../../components/MapOptions'
import NextMatchCounter from '../../components/NextMatchCounter'

function End() {

    const [endInfoReceived, setEndInfoReceived] = useState(false)

    const [finishers, setFinishers] = useState()
    const [nonFinishers, setNonFinishers] = useState()
    const [mapOptions, setMapOptions] = useState()
    const [votes, setVotes] = useState()
    const [previousMap, setPreviousMap] = useState()
    const [nextMatchTime, setNextMatchTime] = useState()

    const navigate = useNavigate()

    const handleRedirectHome = useCallback(() => {
        navigate('/', {replace: true})
    }, [navigate])

    const handleRedirectGame = useCallback(() => {
        navigate('/game', {replace: true})
    }, [navigate])

    useEffect(() => {
        socket.emit('getEndInfo')

        const getInfo = data => {
            if(endInfoReceived) return // Already set info.
            if(!data) {
                handleRedirectHome()
                return
            }

            setFinishers(data.finishers)
            setNonFinishers(data.nonFinishers)
            setMapOptions(data.mapOptions)
            setVotes(data.votes)
            setPreviousMap(data.previousMap)
            setNextMatchTime(data.nextMatchTime)

            setEndInfoReceived(true)
        }

        socket.on('endInfo', getInfo)
        socket.on('nextGame', handleRedirectGame)

        return () => {
            socket.off('endInfo', getInfo)
            socket.off('nextGame', handleRedirectGame)
        }
    }, [])
    

    if(endInfoReceived) return (
        <div className='page' >
            
            <div className='container-title'>
                <h1 className='text-title'>mazeonline</h1>
            </div>

            <FinishersList finishers={finishers} nonFinishers={nonFinishers} />

            <NextMatchCounter time={nextMatchTime} />

            <MapOptions mapOptions={mapOptions} votes={votes} previousMap={previousMap} />
        </div>
    )

    else return <p className='loading-container'>Loading...</p>
}

export default End