import React, { useCallback } from 'react'
import { Graphics, Text } from '@pixi/react'
import { TextStyle, TextMetrics } from '@pixi/text'
import { PLAYER_RADIUS, LARGE_LINE_WIDTH } from '../../../settings/constants'

import './style.css'

function NamePlate(props) {
    
    const name = props.name
    const x = props.x
    const y = props.y

    let textStyle = new TextStyle({
        align: 'center',
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: 400,
        fill: '#ffffff', // gradient
    })

    let textMetrics = TextMetrics.measureText(name, textStyle)
    let verticalSpacing = textMetrics.height/2 + PLAYER_RADIUS/2 + 5

    const draw = useCallback(g => {
        let spacing = 10 // horizontal, to add more space between end of the text and end of NamePlate box.
        let minWidth = 55

        let targetWidth = textMetrics.width + 2*spacing
        let rectWidth = targetWidth > minWidth ? targetWidth : minWidth

        g.clear()
        g.beginFill(0x303030, 0.8)
        g.lineStyle(LARGE_LINE_WIDTH,0,0)


        g.drawRoundedRect(-rectWidth/2, -textMetrics.height/2, rectWidth, textMetrics.height, 6)
        g.endFill()
        
    }, [])

    return(
        <>
            <Graphics draw={draw} x={x} y={y + verticalSpacing} />
            <Text text={name} anchor={0.5} x={x} y={y + verticalSpacing} style={textStyle} resolution={4} />
        </>
    )
}

export default NamePlate