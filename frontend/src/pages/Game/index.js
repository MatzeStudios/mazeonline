import React, { useState, useEffect, useCallback } from "react"
import { Stage, Container } from '@inlet/react-pixi'
import "./style.css"
import socket from "../../services/socket"
import {useNavigate} from 'react-router-dom'

import Maze from "../../components/Maze"
import Player from "../../components/Player"
import OtherPlayers from "../../components/OtherPlayers"
import Path from "../../components/Path"
import VisitedCells  from '../../components/VisitedCells'

const useResize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const onResize = () => {
            requestAnimationFrame(() => {
                setSize([window.innerWidth, window.innerHeight])        
            })
        };

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);

    return size;
};

function Game() {
    
    const [width, height] = useResize();

    const [maze, setMaze] = useState();
    const [freezePlayer, setFreeze] = useState(true);

    const navigate = useNavigate()

    const handleRedirectHome = useCallback(() => {
        navigate('/', {replace: true})
    }, [navigate])

    useEffect(() => {
        socket.emit("getMaze") // asks for the maze

        socket.on("getMaze", data => { // get response from server
            if(data) setMaze(data)
            else handleRedirectHome()
        })
        
        socket.on("gameStarting", data => {
            setTimeout(() => setFreeze(false), data)
        })

        socket.on("gameRunning", () => { setFreeze(false) })

    }, [handleRedirectHome]);

    const [xp, setXp] = useState(undefined);
    const [yp, setYp] = useState(undefined);

    if(maze) return (
        <Stage
        width={width}
        height={height}
        options={{
            antialias: true,
            autoDensity: true,
            backgroundColor: 0x3d3d3d}}
        >
            <Container position={[100, 100]}>
                <VisitedCells xp={xp} yp={yp} maze={maze} />
                <Path xp={xp} yp={yp} />
                <Maze maze={maze} />
                <OtherPlayers maze={maze} />
                <Player maze={maze} freeze={freezePlayer} setXp={setXp} setYp={setYp}/>  
            </Container>
        </Stage>
    )

    return (
        <p> Loading... </p>
    )
}

export default Game