import React, { useState, useCallback, useEffect } from "react"
import { Graphics, useTick } from '@inlet/react-pixi'
import { BASE_SIZE, PLAYER_RADIUS } from '../../settings/constants'
import socket from "../../services/socket"

const N = 1
const E = 2
const W = 4
const S = 8

const verifyMovement = (xi, yi, xf, yf, maze) => {
    let xiI = Math.floor(xi)
    let yiI = Math.floor(yi)
    let xfI = Math.floor(xf)
    let yfI = Math.floor(yf)

    if(xiI === xfI && yiI === yfI) // não muda de célula -> realiza o movimento
        return [xf,yf]

    // muda de célula

    if(xiI !== xfI && yiI !== yfI) { // tentando mudar de célula na diagonal
        if(xfI > xiI  && (maze.grid[yiI][xiI] & E) !== 0)
            return [xf,yi]

        if(xfI < xiI  && (maze.grid[yiI][xiI] & W) !== 0)
            return [xf,yi]

        if(yfI > yiI  && (maze.grid[yiI][xiI] & S) !== 0)
            return [xi,yf]

        if(yfI < yiI  && (maze.grid[yiI][xiI] & N) !== 0)
            return [xi,yf]

        return [xi,yi]
    }

    if(xfI > xiI)
        return (maze.grid[yiI][xiI] & E) !== 0 ? [xf,yf] : [xi,yf]   // -> realiza somente o movimento que não é na direção
                                                                    // da parede, se ela existir, e o movimento completo
                                                                    // se ela não existir existir

    if(xfI < xiI)
        return (maze.grid[yiI][xiI] & W) !== 0 ? [xf,yf] : [xi,yf]

    if(yfI > yiI)
        return (maze.grid[yiI][xiI] & S) !== 0 ? [xf,yf] : [xf,yi]

    if(yfI < yiI)
        return (maze.grid[yiI][xiI] & N) !== 0 ? [xf,yf] : [xf,yi]
}

const newPosition = (x, y, vx, vy, m) => {
    const invsqrt2 = 0.70710678118
    var nx, ny
    if(vx === 0 || vy === 0) {
        nx = x + vx * m
        ny = y + vy * m
    }
    else {
        nx = x + vx * m * invsqrt2
        ny = y + vy * m * invsqrt2
    }
    return [nx,ny]
}

function OtherPlayers(props) {
    
    const maze = props.maze
    const [players, setPlayers] = useState([])
    const [id, setId] = useState()
    const [forceRedraw, setForceRedraw] = useState(false)
    
    useEffect(() => {
        socket.emit("getId")
        socket.on("getId", data => {
            setId(data)
        })
    }, []);

    useEffect(() => {
        socket.on("positions", data => {
            setPlayers(data)
        });
    }, []);

    useTick(delta => {

        for(let i = 0; i < players.length; i++) {
            let p = players[i]

            let base = p.running ? 0.1 : 0.05

            let nx, ny;
            [nx, ny] = newPosition(p.x, p.y, p.vx, p.vy, delta * base);
            [nx, ny] = verifyMovement(p.x, p.y, nx, ny, maze);
    
            p.x = nx
            p.y = ny
        }

        setForceRedraw(c => !c)
    })

    const draw = useCallback(g => {
        g.clear()
        g.beginFill(0x0033cc, 1)
        g.lineStyle(2,0,1)

        for(let i=0; i<players.length; i++) {
            let player = players[i]
            if(player.id !== id) g.drawRect(player.x*BASE_SIZE - PLAYER_RADIUS, player.y*BASE_SIZE - PLAYER_RADIUS, PLAYER_RADIUS*2, PLAYER_RADIUS*2)
        }

        g.endFill()
    }, [players, forceRedraw, id]);

    return(
        <Graphics draw={draw} />
    )
}

export default OtherPlayers