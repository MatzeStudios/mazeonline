import React, { useState, useEffect } from "react"
import { Stage } from '@inlet/react-pixi'
import "./style.css"

import Maze, { MazeClass } from "../../components/Maze"
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

function Game(props) {
    const socket = props.socket

    const [maze, setMaze] = useState(new MazeClass(15,15)); 

    const [width, height] = useResize();

    return (
        <Stage
        width={width}
        height={height}
        options={{
            antialias: true,
            autoDensity: true,
            backgroundColor: 0x3d3d3d}}
        >

    	    <Maze maze={maze} />
    	    <OtherPlayers socket={socket} />
            <Player maze={maze} socket={socket}/>

        </Stage>
    )
}

export default Game