import React, { useEffect, useState, useRef } from 'react'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function Counter(props) {
    const initialTimer = props.time

    const [intervalRef, setIntervalRef] = useState()
    const [time, setTime] = useState(Math.ceil(initialTimer/1000))

    const counterUptadeRef = useRef();

    useEffect(() => {
        counterUptadeRef.current = () => {
            if(time > 1) {
                setTime(t => t-1)
                return
            }
            setTime(t => t-1)
            setTimeout(() => {
                setTime(t => t-1)
                clearInterval(intervalRef)
            }, 333) // delay to clear "Go!" text
        }
    }, [time]);

    useEffect(() => {
        let interval
        setTimeout(() => {
            setTime(t => t-1)
            interval = setInterval(() => counterUptadeRef.current(), 1000)
            setIntervalRef(interval)
        }, initialTimer % 1000)

        return () => clearInterval(intervalRef)
    }, [])

    if( time > 0 ) return <p className='counter-number'>{time}</p>
    else if(time === 0) return <p className='counter-number'>Go!</p>
    return null
}

export default Counter