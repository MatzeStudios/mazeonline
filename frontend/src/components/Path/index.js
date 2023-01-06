import React, { useState, useCallback } from "react"
import { Graphics } from '@inlet/react-pixi'
import { BASE_SIZE } from '../../settings/constants'
import useEventListener from '@use-it/event-listener'

const appendVisitedCell = (x, y, visitedCells) => {
    x = Math.floor(x)
    y = Math.floor(y)
    if(visitedCells.length !== 0 && visitedCells[visitedCells.length-1].x === x && visitedCells[visitedCells.length-1].y === y) return
    for(let i=0;i < visitedCells.length;i++){
        if(visitedCells[i].x === x && visitedCells[i].y === y){
            takeOffVisited(i+1, visitedCells)
            return
        }
    }
    visitedCells.push({x:x, y:y})
}

const takeOffVisited = (index, visitedCells) => {
    visitedCells.splice(index, visitedCells.length - index)
}

function Path(props) {

    const xp = props.xp
    const yp = props.yp
    const visitedCells = useState([])[0]
    const [isVisible, setIsVisible] = useState(false)

    useEventListener('keydown', (event) => {
        if(event.key.toLowerCase() === 'q') setIsVisible(c => !c)
    })

    const draw = useCallback(g => {
        appendVisitedCell(xp, yp, visitedCells)
        
        g.clear()
        if(visitedCells.length === 0 || !isVisible) return
        g.lineStyle(2,0,1)
        g.moveTo((visitedCells[0].x + 0.5) * BASE_SIZE, (visitedCells[0].y + 0.5) * BASE_SIZE)
        for(let i=0;i<visitedCells.length;i++){
            let x = (visitedCells[i].x + 0.5) * BASE_SIZE
            let y = (visitedCells[i].y + 0.5) * BASE_SIZE
            g.lineTo(x, y)
        }
        g.endFill()
    }, [xp, yp, isVisible, visitedCells]);

    return(
        <Graphics draw={draw} />
    )
}

export default Path