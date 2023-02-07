import React, { useState, useCallback, useEffect } from "react"
import { Graphics } from '@inlet/react-pixi'
import { utils } from 'pixi.js';
import { BASE_SIZE } from '../../settings/constants'
import useEventListener from '@use-it/event-listener'

const appendVisitedCell = (x, y, visitedCells) => {
    x = Math.floor(x)
    y = Math.floor(y)
    if(visitedCells[y][x]) return false // already visited

    visitedCells[y][x] = true
    return true
}

function VisitedCells(props) {

    const xp = props.xp
    const yp = props.yp
    const maze = props.maze
    const [visitedCells, setVisitedCells] = useState(undefined)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const aux = []
        for (var i = 0; i < maze.height; i++) {
            let line = [];
            for (var j = 0; j < maze.width; j++) {
                line.push(false);
            }
            aux.push(line);
        }
        setVisitedCells(aux)
    }, [maze.height, maze.width])

    useEventListener('keydown', (event) => {
        if(event.key.toLowerCase() === 'e') setIsVisible(c => !c)
    })

    const draw = useCallback(g => {
        console.log("draw visited cells")
        if(!visitedCells || xp === undefined || yp === undefined) return

        let changed = appendVisitedCell(xp, yp, visitedCells)
        if(!changed && !isVisible) {
            g.clear()
            return
        }

        g.clear()
        if(visitedCells.length === 0 || !isVisible) return

        g.lineStyle(0,0,1)
        let colorHighlight = utils.string2hex(props.color)
        g.beginFill(colorHighlight, 0.3)
        for(let y=0; y<maze.height; y++){
            for(let x=0; x<maze.width; x++){
                if(visitedCells[y][x] && (x != maze.sx || y != maze.sy) && (x != maze.ex || y != maze.ey))
                    g.drawRect(x*BASE_SIZE, y*BASE_SIZE, BASE_SIZE, BASE_SIZE)
            }
        }
        g.endFill()
    }, [xp, yp, isVisible, visitedCells, maze.height, maze.width]);

    return(
        <Graphics draw={draw} />
    )
}

export default VisitedCells