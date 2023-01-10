import React, { useCallback } from "react"
import { Graphics, Text } from '@inlet/react-pixi'
import { PLAYER_RADIUS, LARGE_LINE_WIDTH } from '../../../settings/constants'
import * as PIXI from 'pixi.js'

import './style.css'

function NamePlate(props) {
    
    const name = props.name
    const x = props.x
    const y = props.y

    let textStyle = new PIXI.TextStyle({
        align: 'center',
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: 400,
        fill: '#ffffff', // gradient
    })

    let textMetrics = PIXI.TextMetrics.measureText(name, textStyle)
    let verticalSpacing = textMetrics.height/2 + PLAYER_RADIUS/2 + 17

    const draw = useCallback(g => {
        let spacing = 10 // horizontal, to add more space between end of the text and end of NamePlate box.
        let triangleHeight = 10
        let minWidth = 55

        let targetWidth = textMetrics.width + 2*spacing
        let rectWidth = targetWidth > minWidth ? targetWidth : minWidth

        g.clear()
        g.beginFill(0x303030, 1)
        g.lineStyle(LARGE_LINE_WIDTH,0,1)


        g.drawRoundedRect(-rectWidth/2, -textMetrics.height/2, rectWidth, textMetrics.height, 10)
        g.endFill()


        g.lineStyle(LARGE_LINE_WIDTH,0x303030,1)
        g.beginFill(0x303030);
        g.moveTo(-triangleHeight, -textMetrics.height/2);
        g.lineTo(0, -triangleHeight -textMetrics.height/2);
        g.lineTo(+triangleHeight, -textMetrics.height/2);
        g.lineTo(-triangleHeight, -textMetrics.height/2);
        g.endFill()
        
        g.lineStyle(LARGE_LINE_WIDTH,0,1)
        g.moveTo(-triangleHeight-5, -textMetrics.height/2);
        g.lineTo(-triangleHeight, -textMetrics.height/2);
        g.lineTo(0, -triangleHeight -textMetrics.height/2);
        g.lineTo(+triangleHeight, -textMetrics.height/2);
        g.lineTo(+triangleHeight+5, -textMetrics.height/2);
    }, []);

    return(
        <>
            <Graphics draw={draw} x={x} y={y + verticalSpacing} />
            <Text text={name} anchor={0.5} x={x} y={y + verticalSpacing} style={textStyle} resolution={4} />
        </>
    )
}

export default NamePlate