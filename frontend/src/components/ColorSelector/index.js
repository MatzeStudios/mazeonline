import React, { useEffect, useState, useCallback } from 'react'

// styles
import './index.css'


function ColorSelector() { 
    const [colors , setColors] = useState(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#BD00FF', '#FA00FF'])
    const [selected, setSelected] = useState(colors[0])
    
    useEffect(() => {
        const divs = document.querySelector('.container-select-player-color').querySelectorAll(".wrapper-player-color")
        divs.forEach((e, i) => {
            e.style.backgroundColor = colors[i]
        })
    }, [])
    
    const handleSelected = (e) => {     
        const divs = document.querySelector('.container-select-player-color').querySelectorAll(".wrapper-player-color")
        divs.forEach((div, i) => {
            if (div !== e) {
                div.classList.remove('selected')
            } else {
                e.classList.add('selected')
                setSelected(colors[i])
            }
        })
    }

    return (
        <div className='container-select-player-color'>

            <div className={`wrapper-player-color color-default-1 selected`} onClick={(e) => handleSelected(e.target)}> </div>
            <div className={`wrapper-player-color color-default-2`} onClick={(e) => handleSelected(e.target)}> </div>
            <div className={`wrapper-player-color color-default-3`} onClick={(e) => handleSelected(e.target)}> </div>
            <div className={`wrapper-player-color color-default-4`} onClick={(e) => handleSelected(e.target)}> </div>
            <div className={`wrapper-player-color color-default-5`} onClick={(e) => handleSelected(e.target)}> </div>
            <div className={`wrapper-player-color color-default-6`} onClick={(e) => handleSelected(e.target)}> </div>

            <div className='wrapper-player-color color-select'>  </div>
        </div>
    )
}

export default ColorSelector
