import useEventListener from '@use-it/event-listener'
import React, { useState, useCallback, useEffect, useRef } from "react"
import { Graphics, useTick } from '@inlet/react-pixi'
import { BASE_SIZE } from '../../settings/constants'
import socket from "../../services/socket"

const N = 1
const E = 2
const W = 4
const S = 8

const verifyMovement = (xi, yi, xf, yf, radius, maze) => {
    let xiI = Math.floor(xi)
    let yiI = Math.floor(yi)
    let xfI = Math.floor(xf)
    let yfI = Math.floor(yf)

    if(xiI == xfI && yiI == yfI) // não muda de célula -> realiza o movimento
        return [xf,yf]

    // muda de célula

    if(xiI != xfI && yiI != yfI) { // tentando mudar de célula na diagonal
        if(xfI > xiI  && (maze.grid[yiI][xiI] & E) != 0)
            return [xf,yi]

        if(xfI < xiI  && (maze.grid[yiI][xiI] & W) != 0)
            return [xf,yi]

        if(yfI > yiI  && (maze.grid[yiI][xiI] & S) != 0)
            return [xi,yf]

        if(yfI < yiI  && (maze.grid[yiI][xiI] & N) != 0)
            return [xi,yf]

        return [xi,yi]
    }

    if(xfI > xiI)
        return (maze.grid[yiI][xiI] & E) != 0 ? [xf,yf] : [xi,yf]   // -> realiza somente o movimento que não é na direção
                                                                    // da parede, se ela existir, e o movimento completo
                                                                    // se ela não existir existir

    if(xfI < xiI)
        return (maze.grid[yiI][xiI] & W) != 0 ? [xf,yf] : [xi,yf]

    if(yfI > yiI)
        return (maze.grid[yiI][xiI] & S) != 0 ? [xf,yf] : [xf,yi]

    if(yfI < yiI)
        return (maze.grid[yiI][xiI] & N) != 0 ? [xf,yf] : [xf,yi]
}

function Player(props) {

    const maze = props.maze

    const [x, setX] = useState(maze.sx + .5);
    const [y, setY] = useState(maze.sy + .5);
    const radius = BASE_SIZE / 5;

    const [leftHeld, setLeftHeld] = useState(false);
    const [rightHeld, setRightHeld] = useState(false);
    const [upHeld, setUpHeld] = useState(false);
    const [downHeld, setDownHeld] = useState(false);
    const [shiftHeld, setShiftHeld] = useState(false);
    
    useEventListener('keydown', (event) => {
        if(event.key.toLowerCase() == 'w') setUpHeld(true)
        if(event.key.toLowerCase() == 'a') setLeftHeld(true)
        if(event.key.toLowerCase() == 's') setDownHeld(true)
        if(event.key.toLowerCase() == 'd') setRightHeld(true)
        if(event.key.toLowerCase() == 'shift') setShiftHeld(true)
    })
    
    useEventListener('keyup', (event) => {
        if(event.key.toLowerCase() == 'w') setUpHeld(false)
        if(event.key.toLowerCase() == 'a') setLeftHeld(false)
        if(event.key.toLowerCase() == 's') setDownHeld(false)
        if(event.key.toLowerCase() == 'd') setRightHeld(false)
        if(event.key.toLowerCase() == 'shift') setShiftHeld(false)
    })

    useTick(delta => {
        let invsqrt2 = 0.70710678118

        let base = shiftHeld ? 0.1 : 0.05

        let vx = 0
        let vy = 0

        vx += leftHeld ? -1 : 0
        vx += rightHeld ? 1 : 0
        vy += upHeld ? -1 : 0
        vy += downHeld ? 1 : 0

        let nx, ny
        if(vx == 0 || vy == 0) {
            nx = x + vx * delta * base
            ny = y + vy * delta * base
        }
        else {
            nx = x + vx * delta * base * invsqrt2
            ny = y + vy * delta * base * invsqrt2
        }

        [nx, ny] = verifyMovement(x, y, nx, ny, radius, maze)

        setX(nx)
        setY(ny)
    })

    const emitPosition = () => {
        socket.emit("positionUpdate", {x: x, y: y})
    }

    // logica para usar uma função que mutável no setInterval
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = emitPosition
    }, [x, y]);

    useEffect(() => {
        const interval = setInterval(() => savedCallback.current(), 50)
        return () => clearInterval(interval)
    }, []);

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(0x0033cc, 1)
        g.lineStyle(2,0,1)
        g.drawRect(-radius
            , -radius
            , radius*2
            , radius*2) //para modificar o formato (desenha retangulo) g, raio(radius) e numero de lados(n)
        g.endFill()
    }, []);

    return(
        <Graphics draw={draw} x={x * BASE_SIZE} y={y * BASE_SIZE} />
    )
}

export default Player