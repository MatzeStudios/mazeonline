import React, { useState, useEffect, useCallback, useRef, forwardRef } from "react"
import { Stage, PixiComponent, useApp } from '@inlet/react-pixi'
import "./style.css"
import socket from "../../services/socket"
import {useNavigate} from 'react-router-dom'
import { Viewport } from "pixi-viewport";

import Maze from "../../components/Maze"
import Player from "../../components/Player"
import OtherPlayers from "../../components/OtherPlayers"
import Path from "../../components/Path"
import VisitedCells  from '../../components/VisitedCells'
import { BASE_SIZE } from "../../settings/constants"

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

const PixiViewportComponent = PixiComponent("Viewport", {
    create(props) {
        const { app, ...viewportProps } = props;

        const viewport = new Viewport({
            ticker: props.app.ticker,
            interaction: props.app.renderer.plugins.interaction,
            ...viewportProps
        });

        // activate plugins
        (props.plugins || []).forEach((plugin) => {
            viewport[plugin]();
        });

        return viewport;
    },
    applyProps(viewport, _oldProps, _newProps) {
        const { plugins: oldPlugins, children: oldChildren, ...oldProps } = _oldProps;
        const { plugins: newPlugins, children: newChildren, ...newProps } = _newProps;

        Object.keys(newProps).forEach((p) => {
            if (oldProps[p] !== newProps[p]) {
                viewport[p] = newProps[p];
            }
        });
    },
    didMount() {
        console.log("viewport mounted");
    }
});

// create a component that can be consumed
// that automatically pass down the app
const PixiViewport = forwardRef((props, ref) => (
    <PixiViewportComponent ref={ref} app={useApp()} {...props} />
));

function Game() {
    
    const viewportRef = useRef();

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

    useEffect(() => {
        if(maze && viewportRef.current) viewportRef.current.snap(maze.width * BASE_SIZE/2,maze.height * BASE_SIZE/2, {time: 0, removeOnComplete: true})
    }, [viewportRef.current, maze])

    const [xp, setXp] = useState(undefined);
    const [yp, setYp] = useState(undefined);

    if(maze) return (
        <Stage
        width={width}
        height={height}
        options={{
            antialias: false,
            autoDensity: true,
            backgroundColor: 0x3d3d3d}}
        >
            <PixiViewport
            ref={viewportRef}
            plugins={["drag", "pinch", "wheel"]}//, "decelerate"]}
            screenWidth={width}
            screenHeight={height}
            worldWidth={maze.width * BASE_SIZE}
            worldHeight={maze.height * BASE_SIZE}
            >
                <VisitedCells xp={xp} yp={yp} maze={maze} />
                <Path xp={xp} yp={yp} />
                <Maze maze={maze} />
                <OtherPlayers maze={maze} />
                <Player maze={maze} freeze={freezePlayer} setXp={setXp} setYp={setYp}/>
            </PixiViewport>
        </Stage>
    )

    return (
        <p> Loading... </p>
    )
}

export default Game