import React, { useState, useEffect } from "react"
import { Stage } from '@inlet/react-pixi'
import "./style.css"

import Maze from "../../components/Maze"
import Player from "../../components/Player"

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

    return (
        <Stage
        width={width}
        height={height}
        options={{
            antialias: true,
            autoDensity: true,
            backgroundColor: 0x3d3d3d}
        }>

    	    <Maze />
            <Player />

        </Stage>
    )
}

export default Game