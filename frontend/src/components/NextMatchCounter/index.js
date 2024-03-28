import React, { useEffect, useState, useRef } from 'react'

import './style.css'

function NextMatchCounter(props) {
    const initialTimer = props.time

    const [time, setTime] = useState(Math.ceil(initialTimer/1000))

    const counterUptadeRef = useRef()

    useEffect(() => {
        counterUptadeRef.current = (interval) => {
            if(time > 1) {
                setTime(t => t-1)
                return
            }
            setTime(t => t-1)
            clearInterval(interval)
        }
    }, [time])

    useEffect(() => {
        let interval
        let initialTimeout = setTimeout(() => {
            setTime(t => t-1)
            interval = setInterval(() => counterUptadeRef.current(interval), 1000)
        }, initialTimer % 1000)

        return () => {
            clearInterval(interval)
            clearTimeout(initialTimeout)
        }
    }, [])

    
    if( time > 1 ) return <p className='next-match-count'> Vote em um tamanho de mapa para a próxima rodada. A próxima partida irá começar em { time } segundos. </p>
    if( time === 1 ) return <p className='next-match-count'> Vote em um tamanho de mapa para a próxima rodada. A próxima partida irá começar em 1 segundo. </p>
    return <p className='next-match-count'> Vote em um tamanho de mapa para a próxima rodada. A próxima partida irá começar em breve. </p>
}

export default NextMatchCounter
