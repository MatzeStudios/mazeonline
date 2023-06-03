import React, { useEffect, useState, useCallback } from 'react'
import {useNavigate} from 'react-router-dom'
import socket from '../../services/socket'
import ColorSelector from '../../components/ColorSelector'
import Controls from '../../components/Controls'

// styles
import './index.css'

//fonts
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

function Entry() {
    const [nickname, setNickname] = useState('')
    const [color, setColor] = useState('')
    const [numPlayers, setNumPlayers] = useState('')
    const navigate = useNavigate()

    const [connectedToServer, setConnectedToServer] = useState(socket.connected)
    
    const handleOnClick = useCallback(() => {
        navigate('/game', {replace: true})
        socket.emit('playerStart', {nickname: nickname, color: color})
    }, [navigate, nickname, color])

    useEffect(() => {
        socket.emit('getNumPlayers')

        const numPlayersListener = data => setNumPlayers(data)

        socket.on('numPlayers', numPlayersListener)
      
        return () => {
            socket.off('numPlayers', numPlayersListener)
        }
    }, [])

    useEffect(() => {
        setConnectedToServer(socket.connected)
    }, [socket.connected]);

    return (
        <div className='page'>
            <div className='container-title'>
                <h1 className='text-title'>mazeonline</h1>
            </div>

            <div className='container-input-nickname'>
                <label className='text-input-title' htmlFor='nickname'>Digite seu nickname</label>

                <input className='input-nickname' type='text' name='nickname' id='nickname' autoFocus onChange={event => setNickname(event.target.value)} onKeyDown={ (event) => {if (event.key === 'Enter') handleOnClick()} } />
                <button className='button-nickname' type='button' onClick={handleOnClick} ><div className='arrRight' type="submit"></div></button>
            </div>
            <ColorSelector onSelect={color => setColor(color)} />

            <div className='container-players-online'>
                {
                    connectedToServer ?
                    <>
                        <p className='text-num-players'> {numPlayers} </p>
                        <p className='text-players-online'>Jogadores Online</p>
                    </> :
                        <p className='text-players-online'>Conectando...</p>
                }
            </div>
            
            <Controls border={true}/>
        </div>
    )
}

export default Entry