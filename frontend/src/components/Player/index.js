import useEventListener from '@use-it/event-listener'
import React, { useState, useCallback, useEffect, useRef } from "react"
import { utils } from 'pixi.js';
import { Graphics, useTick } from '@inlet/react-pixi'
import { BASE_SIZE, PLAYER_RADIUS, THIN_LINE_WIDTH } from '../../settings/constants'
import socket from "../../services/socket"

const N = 1
const E = 2
const W = 4
const S = 8

export const drawPlayer = (x, y, radius, g, nSides) => {
    if(nSides === 0) {
        g.drawCircle(x, y, radius)
    }
    else if(nSides === 1) {
        g.drawCircle(x, y, 2)
    }
    else {
        const angle = (360 / nSides) * Math.PI / 180
        let rotation = 0
        if(nSides === 3) rotation = - Math.PI / 2
        else if(nSides === 4) rotation = Math.PI / 4
        else if(nSides === 5) rotation = - Math.PI / 10
        else if(nSides === 6) rotation = 0
        else if(nSides === 7) rotation = Math.PI / 14
        else if(nSides === 8) rotation = Math.PI / 8

        g.moveTo(radius * Math.cos(rotation), radius * Math.sin(rotation))
        for (let i = 1; i <= nSides+1; i++)
            g.lineTo(radius * Math.cos(angle * i + rotation), radius * Math.sin(angle * i + rotation))
    }
}

const verifyMovement = (xi, yi, xf, yf, maze, freeze) => {
    let xiI = Math.floor(xi)
    let yiI = Math.floor(yi)
    let xfI = Math.floor(xf)
    let yfI = Math.floor(yf)

    if(xiI === xfI && yiI === yfI) // não muda de célula -> realiza o movimento
        return [xf,yf]

    // muda de célula

    if(xiI !== xfI && yiI !== yfI) { // tentando mudar de célula na diagonal
        if(!freeze){
            if(xfI > xiI  && (maze.grid[yiI][xiI] & E) !== 0)
                return [xf,yi]

            if(xfI < xiI  && (maze.grid[yiI][xiI] & W) !== 0)
                return [xf,yi]

            if(yfI > yiI  && (maze.grid[yiI][xiI] & S) !== 0)
                return [xi,yf]

            if(yfI < yiI  && (maze.grid[yiI][xiI] & N) !== 0)
                return [xi,yf]
        }
        return [xi,yi]
    }

    if(xfI > xiI)                       // Tentando mudar para celula adjacente
        return ((maze.grid[yiI][xiI] & E) !== 0 && !freeze) ? [xf,yf] : [xi,yf]   // -> realiza somente o movimento que não é na direção
                                                                    // da parede, se ela existir, e o movimento completo
                                                                    // se ela não existir existir

    if(xfI < xiI)                       // Tentando mudar para celula adjacente
        return ((maze.grid[yiI][xiI] & W) !== 0 && !freeze) ? [xf,yf] : [xi,yf]

    if(yfI > yiI)                       // Tentando mudar para celula adjacente
        return ((maze.grid[yiI][xiI] & S) !== 0 && !freeze) ? [xf,yf] : [xf,yi]

    if(yfI < yiI)                       // Tentando mudar para celula adjacente
        return ((maze.grid[yiI][xiI] & N) !== 0 && !freeze) ? [xf,yf] : [xf,yi]

}

function Player(props) {

    const maze = props.maze
    const color = props.color
    let freeze = props.freeze
    const mousePosition = props.mousePosition;
    const rightMouseButtonPressed = props.rightMouseButtonPressed;
    const nSides = props.nSides

    const [x, setX] = useState(maze.sx + .5);
    const [y, setY] = useState(maze.sy + .5);
    const [xC, setXC] = useState(undefined);
    const [yC, setYC] = useState(undefined);
    
    const [leftHeld, setLeftHeld] = useState(false);
    const [rightHeld, setRightHeld] = useState(false);
    const [upHeld, setUpHeld] = useState(false);
    const [downHeld, setDownHeld] = useState(false);
    const [shiftHeld, setShiftHeld] = useState(false);
    
    useEventListener('keydown', (event) => {
        if(event.key.toLowerCase() === 'w') setUpHeld(true)
        if(event.key.toLowerCase() === 'a') setLeftHeld(true)
        if(event.key.toLowerCase() === 's') setDownHeld(true)
        if(event.key.toLowerCase() === 'd') setRightHeld(true)
        if(event.key.toLowerCase() === 'shift') setShiftHeld(true)
    })
    
    useEventListener('keyup', (event) => {
        if(event.key.toLowerCase() === 'w') setUpHeld(false)
        if(event.key.toLowerCase() === 'a') setLeftHeld(false)
        if(event.key.toLowerCase() === 's') setDownHeld(false)
        if(event.key.toLowerCase() === 'd') setRightHeld(false)
        if(event.key.toLowerCase() === 'shift') setShiftHeld(false)
    })

    useEffect(() => {
        const deactivatePresses = () => {
            setUpHeld(false)
            setLeftHeld(false)
            setDownHeld(false)
            setRightHeld(false)
            setShiftHeld(false)
        };
        window.addEventListener('blur', deactivatePresses);
        return () => {
            window.removeEventListener('blur', deactivatePresses);
        };
    }, [])

    useTick(delta => {

        let base = shiftHeld || rightMouseButtonPressed ? 0.1 : 0.05

        let vx = 0
        let vy = 0

        vx += leftHeld ? -1 : 0
        vx += rightHeld ? 1 : 0
        vy += upHeld ? -1 : 0
        vy += downHeld ? 1 : 0

        if(rightMouseButtonPressed) {
            vx += mousePosition.x - x
            vy += mousePosition.y - y
        }

        // normalize velocity vector
        const length = Math.sqrt(vx * vx + vy * vy);
        if(length > 0.1) {
            vx /= length
            vy /= length
        }

        let nx = x + vx * base * delta;
        let ny = y + vy * base * delta;
        [nx, ny] = verifyMovement(x, y, nx, ny, maze, freeze);

        setX(nx)
        setY(ny)

        let cxc = Math.floor(nx)
        let cyc = Math.floor(ny)

        if(cxc !== xC || cyc !== yC) {
            setXC(cxc)
            setYC(cyc)
            props.setXp(cxc)
            props.setYp(cyc)
        }
    })

    // logica para usar uma função que mutável no setInterval
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = () => {
            socket.emit("positionUpdate", {x: x, y: y})
        }
    }, [x,y]);

    useEffect(() => {
        const interval = setInterval(() => savedCallback.current(), 50)
        return () => clearInterval(interval)
    }, []);

    const draw = useCallback(g => {
        g.clear()
        if(freeze)
            g.beginFill(0xff0000, 1)
        else
            g.beginFill(utils.string2hex(color), 1)
        g.lineStyle(THIN_LINE_WIDTH,0,1)
        drawPlayer(0, 0, PLAYER_RADIUS, g, nSides)
        g.endFill()
    }, [freeze]);

    return(
        <Graphics draw={draw} x={x * BASE_SIZE} y={y * BASE_SIZE} />
    )
}

export default Player