import React, { useState, useEffect } from "react"
import { Stage } from '@inlet/react-pixi'
import "./style.css"
import socket from "../../services/socket"

import Maze from "../../components/Maze"
import Player from "../../components/Player"
import OtherPlayers from "../../components/OtherPlayers"

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

    useEffect(() => {
        socket.emit("getMaze") // asks for the maze
        socket.on("getMaze", data => { // get response from server
            setMaze(data)
        })
    }, []);

    if(maze) return (
        <Stage
        width={width}
        height={height}
        options={{
            antialias: true,
            autoDensity: true,
            backgroundColor: 0x3d3d3d}}
        >
            
    	    <Maze maze={maze} />
    	    <OtherPlayers />
            <Player maze={maze} />

        </Stage>
    )

    return (
        <p> Loading... </p>
    )
}

export default Game