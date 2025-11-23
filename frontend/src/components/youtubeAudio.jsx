import { useRef, useState } from 'react';
import MusicFile from '../musica/TropicalContact.mp3';
import "../styles/youtubeAudio.css"

export default function BackgroundMusic() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudio = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <>
            <audio ref={audioRef} src={MusicFile} loop preload="auto" />

            <button
                onClick={toggleAudio}
                className='audio'
                title="Reproducir / Pausar música"
            >
                {isPlaying ? '🔇' : '🎵'}
            </button>
        </>
    );
}
