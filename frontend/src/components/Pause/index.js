import React, { useEffect, useState, useRef } from 'react'

import './index.css'

import Gear from '../../assets/gear.svg'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

import Controls from '../Controls'

function Pause(props) {

    const setOtherPlayersVisibility = props.setOtherPlayersVisibility

    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        const handleClickOutside = event => {
            if (showMenu && !event.target.closest(".container-menu")) {
                setShowMenu(false);
            }
        };

        document.body.addEventListener("click", handleClickOutside);

        return () => {
            document.body.removeEventListener("click", handleClickOutside);
        };
    }, [showMenu]);

    return (
        <>
            <button className='btn-menu'><img src={Gear} alt="gear button for open menu" onClick={toggleMenu}/></button>

            {
                showMenu && (
                <div className='container-menu'>
                    
                    <Controls border={false} />

                    <button onClick={() => setOtherPlayersVisibility('normal')} > normal </button>
                    <button onClick={() => setOtherPlayersVisibility('restricted')} > restricted </button>
                    <button onClick={() => setOtherPlayersVisibility('none')} > none </button>

                </div>
                )
            }

            {showMenu && <div className="overlay" />}
        </>
    )
}


export default Pause 