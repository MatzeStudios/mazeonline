import React, { useEffect, useState, useRef } from 'react'

import './index.css'

import Gear from '../../assets/gear.svg'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function Pause() {


    return (
        <>
            <button className='btn-menu'><img src={Gear} alt="gear button for open menu"/></button>
        </>
    )
}


export default Pause 