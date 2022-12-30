import useEventListener from '@use-it/event-listener'
import React, { useState, useCallback } from "react"
import { Graphics, useTick } from '@inlet/react-pixi'
import { BASE_SIZE } from '../../settings/constants'

function Player(props) {

    const maze = props.maze

    const [x, setX] = useState(maze.sx + 0.5);
    const [y, setY] = useState(maze.sy + 0.5);
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

        [nx, ny] = maze.verifyMovement(x, y, nx, ny, radius)

        setX(nx)
        setY(ny)
    })

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(0x0033cc, 1)
        g.lineStyle(2,0,1)
        g.drawRect(-radius, -radius, radius*2, radius*2)
        g.endFill()
    }, []);

    return(
        <Graphics draw={draw} x={x * BASE_SIZE} y={y * BASE_SIZE} />
    )
}

export default Player