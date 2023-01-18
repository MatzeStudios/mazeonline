import React, { useEffect, useState, useCallback } from 'react'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function Counter(props) {
    const initialTimer = props.time

    const [time, setTime] = useState(Math.ceil(initialTimer/1000))

    useEffect(() => {
        let interval
        setTimeout(() => {
            setTime(t => t-1)
            interval = setInterval(() => {
                setTime(t => t-1)
            }, 1000)
        }, initialTimer % 1000)

        return () => clearInterval(interval)
    }, [])

    if( time > 0 ) return (
        <p className='counter-number'>{time}</p>
    )
    return null
}

export default Counter