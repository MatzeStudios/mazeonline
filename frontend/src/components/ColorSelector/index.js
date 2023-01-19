import React, { useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash';

// styles
import './index.css'


function ColorSelector({ onSelect }) {
    const [colors , setColors] = useState(['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'].reverse())
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const inputRef = useRef(null);
    
    useEffect(() => {
        onSelect(selectedColor);
    }, [selectedColor]);

    const handleSelected = (color) => {
        setSelectedColor(color);
    }

    function handleClick() {
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        inputRef.current.dispatchEvent(clickEvent);
    }

    const debouncedHandleChange = debounce(handleSelected, 100);
    const handleChange = (event) => {
        debouncedHandleChange(event.target.value);
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
            
            <input className='wrapper-player-color' type="color" value={selectedColor} onChange={handleChange} ref={inputRef}/>
        </div>
    )
}

export default ColorSelector
