import React, { useEffect, useState, useRef } from 'react'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function StartCounter(props) {
    const initialTimer = props.time

    const [time, setTime] = useState(Math.ceil(initialTimer/1000))

    const counterUptadeRef = useRef()

    useEffect(() => {
        counterUptadeRef.current = (interval) => {
            if(time > 1) {
                setTime(t => t-1)
                return
            }
            
            let query = document.querySelector('.counter-number')
            if(query) 
                query.animate(
                    [
                        { opacity: '1' },
                        { opacity: '0' }
                    ],

                    {
                        duration: 500,
                        iterations: 1,
                    }
                )
            
            setTime(t => t-1)
            setTimeout(() => {
                setTime(t => t-1)
                clearInterval(interval)
            }, 500) // delay to clear "Go!" text
        }
    }, [time])

    useEffect(() => {
        let interval
        let initialTimeout = setTimeout(() => {
            counterUptadeRef.current()
            if(time > 1) interval = setInterval(() => counterUptadeRef.current(interval), 1000)
        }, initialTimer % 1000)

        return () => {
            clearInterval(interval)
            clearTimeout(initialTimeout)
        }
    }, [])

    if( time > 0 ) return <p className='counter-number'>{time}</p>
    else if(time === 0) return <p className='counter-number'>Go!</p>
    return null
}

export default StartCounter