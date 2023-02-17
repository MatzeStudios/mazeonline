

import React from 'react'

import PlayerModel from '../../components/PlayerModel'

import './style.css'

//fonts 
import '../../fonts/Bungee_Shade/BungeeShade-Regular.ttf'
import '../../fonts/Inter/static/Inter-Regular.ttf'

const finishTimeToString = (ms) => {
    let t = ms/1000
    return Math.floor(t / 60) + ':' + (t % 60).toFixed(2)
}

function FinishersList(props) {

    const finishers = props.finishers
    const nonFinishers = props.nonFinishers
    
    return (
        <>
            <table className='finishers-table'>
                <thead>
                    <tr>
                        <th></th>
                        <th>Jogador</th>
                        <th>Tempo</th>
                        <th>Pontuação</th>
                    </tr>
                </thead>
                <tbody>
                    {finishers.map((player, index) => (
                        <tr key={player.id}>
                            <td>{index + 1}</td>
                            <td className='player'> 
                                <PlayerModel player={player} />
                                <p className='playerName'>{player.nickname}</p> 
                            </td>
                            <td>{finishTimeToString(player.finishTime) }</td>
                            <td>{player.points} (+{player.pointChange})</td>
                        </tr>
                    ))}

                    {nonFinishers.map((player) => (
                        <tr key={player.id}>
                            <td> - </td>
                            <td className='player'> 
                                <PlayerModel player={player} />
                                <p className='playerName'>{player.nickname}</p> 
                            </td>
                            <td>DNF</td>
                            <td>{player.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
    
}

export default FinishersList