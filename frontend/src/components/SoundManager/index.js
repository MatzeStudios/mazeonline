import React, { useState } from "react";
import sound from "../../assets/misteriousSound.mp3"
import Howl from 'react-howler';

function SoundManager() {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
  };

  return (
    <div>
      <Howl
        src={sound}
        playing={playing}
        onLoad={() => console.log('audio loaded')}
        onPlay={() => console.log('audio playing')}
        onPause={() => console.log('audio paused')}
        onStop={() => console.log('audio stopped')}
        onEnd={() => console.log('audio ended')}
      />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}

export default SoundManager;