import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import {socketIOClient, io} from "socket.io-client"

// styles
import './index.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'


const socket = io()

function Entry() {
    const [nickname, setNickname] = useState('')
    const [isConnected, setIsConnected] = useState(socket.connected)
    
    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
          })
      
        socket.on('disconnect', () => {
            setIsConnected(false);
        })
          
    }, [])

    const sendPing = () => {
        socket.emit('ping');
      }

    return (
        <div className='page'>
            <div className='container-title'>
                <h1 className='text-title'>mazeonline</h1>
            </div>

            <div className='container-input-nickname'>
                <label className='text-input-title' htmlFor='nickname'>Digite seu nickname</label>
                <input className='input-nickname' type='text' name='nickname' id='nickname' onChange={event => setNickname(event.target.value)}/>
                <Link
                    to={{
                        pathname: '/game',
                        nickname
                    }}                
                ><button className='button-nickname' type='button' ><div className='arrRight'></div></button></Link>
            </div>
            <div className='container-players-online'>
                <p className='text-num-players'> {500} </p> {/*numero vai receber logica*/}
                <p className='text-players-online'> players online </p>
            </div>
        </div>
    )
}

export default Entry