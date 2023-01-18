import React, { useEffect, useState, useCallback } from 'react'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function Counter() {
    const [time, setTime] = useState(3)

    return (
        <p className='counter-number'>{time}</p>
    )
}

export default Counter