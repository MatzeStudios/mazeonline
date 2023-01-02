import { Graphics } from '@inlet/react-pixi'
import React, { useCallback, useEffect, useState } from "react"
import { BASE_SIZE } from '../../settings/constants'

const N = 1
const E = 2
const W = 4
const S = 8

function Maze(props) {

    const maze = props.maze

    const draw = useCallback(g => {

        g.clear()
        g.lineStyle(4, 0xffffff, 1)

        for(let y = 0; y < maze.height; y++) {
            for(let x = 0; x < maze.width; x++) {

                if( (maze.grid[y][x] & N) == 0 ) {
                    g.moveTo(x * BASE_SIZE, y * BASE_SIZE)
                    g.lineTo((x+1) * BASE_SIZE, y * BASE_SIZE)
                }

                if( (maze.grid[y][x] & W) == 0 ) {
                    g.moveTo(x * BASE_SIZE, y * BASE_SIZE)
                    g.lineTo(x * BASE_SIZE, (y+1) * BASE_SIZE)
                }

            }
        }
        
        g.moveTo(maze.width * BASE_SIZE, maze.height * BASE_SIZE)
        g.lineTo(0, maze.height * BASE_SIZE)
        
        g.moveTo(maze.width * BASE_SIZE, maze.height * BASE_SIZE)
        g.lineTo(maze.width * BASE_SIZE, 0)

    }, []);
    

    return( 
        <Graphics draw={draw} x={0} y={0} />
    )
}

export default Maze