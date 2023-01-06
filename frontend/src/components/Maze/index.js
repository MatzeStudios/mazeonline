import { Graphics } from '@inlet/react-pixi'
import React from "react"
import { BASE_SIZE } from '../../settings/constants'

const N = 1
// const E = 2
const W = 4
// const S = 8

function Maze(props) {

    const maze = props.maze

    const draw = g => { // removed useCallback because map is only drawn once
        let lw = 4

        g.clear()
        g.lineStyle(lw, 0xffffff, 1)
        
        g.moveTo(maze.width * BASE_SIZE, maze.height * BASE_SIZE)
        g.lineTo(0, maze.height * BASE_SIZE)
        
        g.moveTo(maze.width * BASE_SIZE, maze.height * BASE_SIZE)
        g.lineTo(maze.width * BASE_SIZE, 0)

        for(let y = 0; y < maze.height; y++) {
            for(let x = 0; x < maze.width; x++) {

                if( (maze.grid[y][x] & N) === 0 ) {
                    if( maze.sx === x && (maze.sy === y || maze.sy === y-1) )      g.lineStyle(lw, 0x00ff00, 1)
                    else if( maze.ex === x && (maze.ey === y || maze.ey === y-1) ) g.lineStyle(lw, 0xff0000, 1)
                    else g.lineStyle(lw, 0xffffff, 1)
    
                    g.moveTo(x * BASE_SIZE, y * BASE_SIZE)
                    g.lineTo((x+1) * BASE_SIZE, y * BASE_SIZE)
                }

                if( (maze.grid[y][x] & W) === 0 ) {
                    if( (maze.sx === x || maze.sx === x-1) && maze.sy === y )      g.lineStyle(lw, 0x00ff00, 1)
                    else if( (maze.ex === x || maze.ex === x-1) && maze.ey === y ) g.lineStyle(lw, 0xff0000, 1)
                    else g.lineStyle(lw, 0xffffff, 1)

                    g.moveTo(x * BASE_SIZE, y * BASE_SIZE)
                    g.lineTo(x * BASE_SIZE, (y+1) * BASE_SIZE)
                }
            }
        }

        g.lineStyle(lw, 0x00ff00, 1)
        if(maze.sx === maze.width-1) {
            g.moveTo(maze.width * BASE_SIZE, maze.sy * BASE_SIZE)
            g.lineTo(maze.width * BASE_SIZE, (maze.sy+1) * BASE_SIZE)
        }
        if(maze.sy === maze.height-1) {
            g.moveTo(maze.sx * BASE_SIZE, maze.height * BASE_SIZE)
            g.lineTo((maze.sx + 1) * BASE_SIZE, maze.height * BASE_SIZE)
        }

        g.lineStyle(lw, 0xff0000, 1)
        if(maze.ex === maze.width-1) {
            g.moveTo(maze.width * BASE_SIZE, maze.ey * BASE_SIZE)
            g.lineTo(maze.width * BASE_SIZE, (maze.ey+1) * BASE_SIZE)
        }
        if(maze.ey === maze.height-1) {
            g.moveTo(maze.ex * BASE_SIZE, maze.height * BASE_SIZE)
            g.lineTo((maze.ex + 1) * BASE_SIZE, maze.height * BASE_SIZE)
        }
    }
    

    return( 
        <Graphics draw={draw} x={0} y={0} />
    )
}

export default Maze