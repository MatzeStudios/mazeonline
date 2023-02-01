import React, { useEffect, useState, useRef } from 'react'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function Controls() {
    
    return(
        <div class="wasd">
            <div class="key" id="w">W</div>
            <div class="key" id="a">A</div>
            <div class="key" id="s">S</div>
            <div class="key" id="d">D</div>
        </div>
    )
}

export default Controls