import React, { useEffect, useState, useRef } from 'react'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

// icons
import MouseLeft from '../../../src/assets/mouse-left.svg'
import MouseRight from '../../../src/assets/mouse-right.svg'
import MouseScroll from '../../../src/assets/mouse-scroll.svg'
import ArrowKeyUp from '../../../src/assets/arrow-key-up.svg'
import ArrowUp from '../../../src/assets/arrow-up.svg'

function Controls() {
    
    return(
        <>
        <div className='container-controls'>
            <h2>Controles</h2>
            <div className='wrapper-controls row-1'>
                <div className='wrapper-flex-column'>
                    <div className='wrapper-gap-40'>
                        <div className="wrapper-keys text-key">
                            <div className="wrapper-key" id="w">W</div>
                            <div className="wrapper-key" id="a">A</div>
                            <div className="wrapper-key" id="s">S</div>
                            <div className="wrapper-key" id="d">D</div>
                        </div>
                    

                        <div className="wrapper-keys text-key">
                            <div className="wrapper-key" id="arrow-up"> <img src={ArrowKeyUp} alt="arrow up" /> </div>
                            <div className="wrapper-key" id="arrow-left"> <img src={ArrowKeyUp} alt="arrow left" /> </div>
                            <div className="wrapper-key" id="arrow-down"> <img src={ArrowKeyUp} alt="arrow down" /> </div>
                            <div className="wrapper-key" id="arrow-right"> <img src={ArrowKeyUp} alt="arrow right" /> </div>
                        </div>

                        <div className='wrapper-mouse'>
                            <img src={MouseLeft} alt="click left in mouse" />
                        </div>
                    </div>
                    <h3 id='text-movimentation-player'>Movimentação de personagem</h3>
                </div>
                <div className='wrapper-flex-column'>
                    <div className='btn-shift'>
                        <div className='btn-shift-arrow'>
                            <img src={ArrowUp} alt="arrow shift" />
                        </div>
                        <p className='text-key'>SHIFT</p>
                    </div>
                    <h3>Correr</h3>
                </div>
            </div>

            <div className='wrapper-controls row-2'>
                <div className='wrapper-flex-column'>
                    <div className="wrapper-key text-key single-key" id="q">Q</div>
                    <h3>Marcação de caminho</h3>
                </div>
                
                <div className='wrapper-flex-column'>
                    <div className="wrapper-key text-key single-key" id="E">E</div>
                    <h3>Marcação de caminho</h3>
                </div>

                <div className='wrapper-mouse'>
                            <img src={MouseRight} alt="click right in mouse" />
                            <h3>Mover câmera</h3>
                </div>

                <div className='wrapper-mouse'>
                            <img src={MouseScroll} alt="scroll mouse" />
                            <h3>Zoom</h3>
                </div>
            </div>
        </div>
        </>
        
    )
}

export default Controls