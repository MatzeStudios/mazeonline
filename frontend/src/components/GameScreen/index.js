import React, { useState, useEffect, useRef, forwardRef } from "react"
import { Stage, PixiComponent, useApp, Container } from "@inlet/react-pixi"
import { Viewport } from "pixi-viewport"

import socket from "../../services/socket"

import Maze from "../Maze"
import Player from "../Player"
import OtherPlayers from "../OtherPlayers"
import Path from "../Path"
import VisitedCells  from "../VisitedCells"
import { BASE_SIZE } from "../../settings/constants"

const useResize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight])

    useEffect(() => {
        const onResize = () => {
            requestAnimationFrame(() => {
                setSize([window.innerWidth, window.innerHeight])        
            })
        }

        window.addEventListener("resize", onResize)

        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [])

    return size
}

const PixiViewportComponent = PixiComponent("Viewport", {
    create(props) {
        const { ...viewportProps } = props

        const viewport = new Viewport({
            ticker: props.app.ticker,
            interaction: props.app.renderer.plugins.interaction,
            ...viewportProps
        });

        // activate plugins
        (props.plugins || []).forEach((plugin) => {
            viewport[plugin]()
        })

        viewport.drag({
            mouseButtons: "right"
        })

        viewport.fit()
        viewport.moveCenter(viewport.worldWidth/2, viewport.worldHeight/2)
        viewport.clamp({ direction: "all" })
        
        // this is only runs once, to keep updating the clamp in resize there's
        // a copy of this code inside an useEffect in the Game component.
        let czOpts = { minWidth: BASE_SIZE, minHeight: BASE_SIZE }

        let screenAspRat = viewport.screenWidth/viewport.screenHeight
        let worldAspRat  = viewport.worldWidth/viewport.worldHeight

        if(screenAspRat < worldAspRat) czOpts.maxWidth = viewport.worldWidth*1.5
        else czOpts.maxHeight = viewport.worldHeight*1.5
        
        viewport.clampZoom(czOpts)
        
        return viewport
    },
    applyProps(viewport, _oldProps, _newProps) {
        const { ...oldProps } = _oldProps
        // eslint-disable-next-line no-unused-vars
        const { plugins: newPlugins, children: newChildren, ...newProps } = _newProps

        Object.keys(newProps).forEach((p) => {
            if (oldProps[p] !== newProps[p]) {
                viewport[p] = newProps[p]
            }
        })
    }//,
    // didMount() {
    //     console.log("viewport mounted");
    // }
})

// create a component that can be consumed
// that automatically pass down the app
const PixiViewport = forwardRef((props, ref) => (
    <PixiViewportComponent ref={ref} app={useApp()} {...props} />
))
PixiViewport.displayName = "PixiViewport"

function GameScreen(props) {
    
    const maze = props.maze
    const playerColor = props.color
    const gameState = props.state
    const freezeDuration = props.freeze
    const playerId = props.playerId
    const playerNSides = props.playerNSides
    const otherPlayersVisibility = props.otherPlayersVisibility
    const players = props.players

    const viewportRef = useRef()

    const [width, height] = useResize()

    const [freezePlayer, setFreeze] = useState(true)

    const [xp, setXp] = useState(undefined)
    const [yp, setYp] = useState(undefined)

    const [playerFinished, setPlayerFinished] = useState(false)

    const [mousePosition, setMousePosition] = useState({x: 0, y: 0})
    const [rightMouseButtonPressed, setRightMouseButtonPressed] = useState(false)
    const appRef = useRef(null)
    
    useEffect(() => {
        if(gameState === "starting") {
            setTimeout(() => setFreeze(false), freezeDuration)
        }
        else if(gameState === "running") {
            setFreeze(false)
        }

    }, [])

    useEffect(() => { // adjust zoom clamp of viewport in resize and screen position
        let viewport = viewportRef.current
        if(!viewport) return

        viewport.fit()
        viewport.moveCenter(viewport.worldWidth/2, viewport.worldHeight/2)

        let czOpts = { minWidth: BASE_SIZE, minHeight: BASE_SIZE }

        let screenAspRat = viewport.screenWidth/viewport.screenHeight
        let worldAspRat  = viewport.worldWidth/viewport.worldHeight

        if(screenAspRat < worldAspRat) czOpts.maxWidth = viewport.worldWidth*1.5
        else czOpts.maxHeight = viewport.worldHeight*1.5

        viewport.clampZoom(czOpts)
    }, [width, height])

    useEffect(() => {
        const deactivateRightPress = () => {
            setRightMouseButtonPressed(false)
        }
        window.addEventListener("blur", deactivateRightPress)
        return () => {
            window.removeEventListener("blur", deactivateRightPress)
        }
    }, [])

    useEffect(() => {
        if(appRef.current === null) return
        appRef.current.app.stage.interactive = true
        const pointerMoveCallback = (event) => {
            requestAnimationFrame(() => {
                if(viewportRef.current === null) return
                const newMousePosition = event.data.global
                let worldCoords = viewportRef.current.toWorld(newMousePosition.x, newMousePosition.y)
                worldCoords.x = worldCoords.x/BASE_SIZE - 1
                worldCoords.y = worldCoords.y/BASE_SIZE - 1
                setMousePosition(worldCoords)
            })
        }
        const pointerDownCallback = (event) => {
            if(event.data.button === 0) setRightMouseButtonPressed(true)
        }
        const pointerUpCallback = (event) => {
            if(event.data.button === 0) setRightMouseButtonPressed(false)
        }

        appRef.current.app.stage.on("pointermove", pointerMoveCallback)
        appRef.current.app.stage.on("pointerdown", pointerDownCallback)
        appRef.current.app.stage.on("pointerup", pointerUpCallback)

    }, [])

    useEffect(() => {
        if(!playerFinished && xp === maze.ex && yp === maze.ey) {
            socket.emit("finished")
            setPlayerFinished(true)
        }
    }, [xp, yp])

    return (
        <Stage 
            width={width}
            height={height}
            options={{
                antialias: false,
                autoDensity: true,
                backgroundColor: 0x3d3d3d}}
            ref={appRef} >

            <PixiViewport
                ref={viewportRef}
                screenWidth={width}
                screenHeight={height}
                worldWidth={(maze.width + 2) * BASE_SIZE}
                worldHeight={(maze.height + 2) * BASE_SIZE}
                plugins={["pinch", "wheel", "decelerate"]} //, "drag"]} -> Set separetly
                disableOnContextMenu={true}
            >
                <Container position={[BASE_SIZE, BASE_SIZE]}>
                    <VisitedCells xp={xp} yp={yp} maze={maze} color={playerColor}/>
                    <Maze maze={maze} freeze={freezePlayer}/>
                    <Path xp={xp} yp={yp} />
                    <OtherPlayers maze={maze} playerId={playerId} visibility={otherPlayersVisibility} players={players} />
                    <Player maze={maze} freeze={freezePlayer} setXp={setXp} setYp={setYp}
                        color={playerColor}
                        mousePosition={mousePosition}
                        rightMouseButtonPressed={rightMouseButtonPressed}
                        nSides={playerNSides} />
                </Container>
            </PixiViewport>
        </Stage>
    )

}

export default GameScreen