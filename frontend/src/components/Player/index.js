import useEventListener from '@use-it/event-listener'
import React, { useState, useCallback } from "react"
import { Graphics, useTick } from '@inlet/react-pixi'

function Player() {
    const [x, setX] = useState(100)
    const [y, setY] = useState(100)

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

    useTick(delta =>{
        let invsqrt2 = 0.70710678118

        let base = shiftHeld ? 5 : 2.5

        let vx = 0
        let vy = 0

        vx += leftHeld ? -1 : 0
        vx += rightHeld ? 1 : 0
        vy += upHeld ? -1 : 0
        vy += downHeld ? 1 : 0

        if(vx == 0 || vy == 0) {
            setX(x + vx * delta * base)
            setY(y + vy * delta * base)
        }
        else {
            setX(x + vx * delta * base * invsqrt2)
            setY(y + vy * delta * base * invsqrt2)
        }

    });

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(0x0033cc, 1)
        g.lineStyle(4,0,1)
        g.drawRect(x - 50, y - 50, 100, 100)
        g.endFill()
    },[x, y]);

    return(
        <Graphics draw={draw} />
    )
}

export default Player