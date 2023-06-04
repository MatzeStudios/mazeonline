import React, { useEffect, useState } from 'react'
import useEventListener from '@use-it/event-listener'

import './index.css'

import Gear from '../../assets/gear.svg'
import Close from '../../assets/close.svg'
import EyeOpen from '../../assets/eye-open.svg'
import EyeClosed from '../../assets/eye-closed.svg'
import EyeBlocked from '../../assets/eye-blocked.svg'

import Controls from '../Controls'

function Pause(props) {

    const setOtherPlayersVisibility = props.setOtherPlayersVisibility

    const [showMenu, setShowMenu] = useState(false)
    const [btnEyeSelected, setBtnEyeSelected] = useState(0)
    
    const toggleMenu = () => {
        setShowMenu(!showMenu)
    }

    useEffect(() => {
        const handleClickOutside = event => {
            if (showMenu && !event.target.closest('.container-menu')) {
                setShowMenu(false)
            }
        }

        document.body.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.body.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showMenu])

    useEventListener('keydown', (event) => {
        if(event.key.toLowerCase() === 'escape') toggleMenu()
    })

    return (
        <>
            <button className='wrapper-btn-click'  onClick={toggleMenu} ><img src={Gear} alt="gear button for open menu"/></button>

            <div className='container-menu' style={{ display: showMenu ? 'block' : 'none' }}>
                <button className='wrapper-btn-click' onClick={toggleMenu} ><img src={Close} alt="close button" /></button>
                <Controls border={false} />


                <hr />
                <div className='container-btn-eye'>
                    <button className='wrapper-btn-eye' onClick={() => [setOtherPlayersVisibility('normal'), setBtnEyeSelected(0)]} > <img src={EyeOpen} alt="button for players visible"  /> </button>
                    <button className='wrapper-btn-eye' onClick={() => [setOtherPlayersVisibility('restricted'), setBtnEyeSelected(1)]} > <img src={EyeClosed} alt="button for players point" /> </button>
                    <button className='wrapper-btn-eye' onClick={() => [setOtherPlayersVisibility('none'), setBtnEyeSelected(2)]} > <img src={EyeBlocked} alt="button for players hidden"  /> </button>
                    <div
                        className='btn-line-select'
                        style={{
                            transform: `translateX(${btnEyeSelected * 133.333 + 16.666}%)`,
                        }}
                    />    
                </div>
            </div>

            {showMenu && <div className="overlay" />}
        </>
    )
}


export default Pause 