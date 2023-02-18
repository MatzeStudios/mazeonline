import React, { useEffect, useState, useRef } from 'react'
import socket from '../../services/socket'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function MapOptions(props) {

    const opts = props.mapOptions
    const [votes, setVotes] = useState(props.votes)
    const previousMap = props.previousMap
    const [maior, setMaior] = useState()

    useEffect(() => {
        let aux = 0
        for(let i=0; i<votes.length; i++) if(votes[i] > aux) aux = votes[i]
        setMaior(aux)
    }, [votes])

    useEffect(() => {
        socket.on('votes', setVotes)

        return () => {
            socket.off('votes', setVotes)
        }
    }, [])

    const sendVote = (index) => {
        socket.emit('vote', index)
    }
    
    return (
        <>
            <p className='map-options-title'> Vote em um tamanho de mapa para a próxima rodada. A próxima partida irá começar em breve... </p>
            <div className='map-options-container'>
                {opts.map((opt, index) => (
                    <div key={index} onClick={() => sendVote(index)} 
                        className={`map-option ${ ((maior !== 0 && votes[index] === maior) || (maior === 0 && index === previousMap)) ? 'next-map' : ''}`}>
                        <h2> {opt.name} </h2>

                        <p className='map-option-dimensions'>{opt.width} x {opt.height}</p>

                        <h3>{votes[index]}</h3> 

                    </div>
                ))}
            </div>
        </>
    )
}

export default MapOptions