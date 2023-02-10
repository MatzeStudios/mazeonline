import React, { useEffect, useState, useRef } from 'react'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function EndCounter(props) {
    const initialTimer = props.time

    const [time, setTime] = useState(Math.ceil(initialTimer/1000))

    const counterUptadeRef = useRef();

    useEffect(() => {
        counterUptadeRef.current = (interval) => {
            if(time > 1) {
                setTime(t => t-1)
                return
            }
            setTime(t => t-1)
            clearInterval(interval)
        }
    }, [time]);

    useEffect(() => {
        let interval
        let initialTimeout = setTimeout(() => {
            setTime(t => t-1)
            interval = setInterval(() => counterUptadeRef.current(interval), 1000)
        }, initialTimer % 1000)

        return () => {
            clearInterval(interval)
            clearTimeout(initialTimeout);
        }
    }, [])

    if( time > 0 ) return <p className='end-counter-number'>{time}</p>
    return null
}

export default EndCounter