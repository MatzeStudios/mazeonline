import { Graphics } from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'
import React from "react"
import { BASE_SIZE, LARGE_LINE_WIDTH } from '../../settings/constants'

const N = 1
const E = 2
const W = 4
const S = 8

const drawCellWalls = (g, maze, x, y, all = false) => {

    if( (maze.grid[y][x] & N) === 0 ) {
        g.moveTo(x * BASE_SIZE, y * BASE_SIZE)
        g.lineTo((x+1) * BASE_SIZE, y * BASE_SIZE)
    }

    if( (maze.grid[y][x] & W) === 0 ) {
        g.moveTo(x * BASE_SIZE, y * BASE_SIZE)
        g.lineTo(x * BASE_SIZE, (y+1) * BASE_SIZE)
    }

    if(all) {
        if( (maze.grid[y][x] & S) === 0 ) {
            g.moveTo(x * BASE_SIZE, (y+1) * BASE_SIZE)
            g.lineTo((x+1) * BASE_SIZE, (y+1) * BASE_SIZE)
        }
    
        if( (maze.grid[y][x] & E) === 0 ) {
            g.moveTo((x+1) * BASE_SIZE, y * BASE_SIZE)
            g.lineTo((x+1) * BASE_SIZE, (y+1) * BASE_SIZE)
        }
    }
}

function Maze(props) {  

    const maze = props.maze

    const draw = g => { // removed useCallback because map is only drawn once

        g.clear()

        g.lineStyle({width: LARGE_LINE_WIDTH, color: 0xffffff, alpha: 1, cap: PIXI.LINE_CAP.ROUND})
        
        g.moveTo(maze.width * BASE_SIZE, maze.height * BASE_SIZE)
        g.lineTo(0, maze.height * BASE_SIZE)
        
        g.moveTo(maze.width * BASE_SIZE, maze.height * BASE_SIZE)
        g.lineTo(maze.width * BASE_SIZE, 0)

        for(let y = 0; y < maze.height; y++) {
            for(let x = 0; x < maze.width; x++) {
                drawCellWalls(g, maze, x, y)
            }
        }

        
        g.lineStyle(0,0,0,0)
        g.beginFill(0x00ff00, 0.3)
        g.drawRect(maze.sx*BASE_SIZE, maze.sy*BASE_SIZE, BASE_SIZE, BASE_SIZE)
        g.endFill()

        g.lineStyle({width: LARGE_LINE_WIDTH, color: 0x00ff00, alpha: 1, cap: PIXI.LINE_CAP.ROUND})
        drawCellWalls(g, maze, maze.sx, maze.sy, true)

        g.lineStyle(0,0,0,0)
        g.beginFill(0xff0000, 0.3)
        g.drawRect(maze.ex*BASE_SIZE, maze.ey*BASE_SIZE, BASE_SIZE, BASE_SIZE)
        g.endFill()
        
        g.lineStyle({width: LARGE_LINE_WIDTH, color: 0xff0000, alpha: 1, cap: PIXI.LINE_CAP.ROUND})
        drawCellWalls(g, maze, maze.ex, maze.ey, true)
    }
    

    return( 
        <Graphics draw={draw} x={0} y={0} />
    )
}

export default Maze