import React, { useState, useEffect } from 'react'

// styles
import './index.css'


function ColorSelector({ onSelect }) {
    const [colors , setColors] = useState(['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'].reverse())
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    
    useEffect(() => {
        onSelect(selectedColor);
    }, [selectedColor]);

    const handleSelected = (color) => {
        setSelectedColor(color);
    }

    return (
        <div className='container-select-player-color'>

            {colors.map((color, i) => (
                <div 
                    key={i} 
                    style={{ backgroundColor: color }}
                    className={`wrapper-player-color ${color === selectedColor ? 'selected' : ''}`}
                    onClick={() => handleSelected(color)}
                > 
                </div>
            ))}

            <div className='wrapper-player-color color-select'> </div>
        </div>
    )
}

export default ColorSelector
