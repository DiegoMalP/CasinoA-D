import { useRef, useState } from 'react';
import MusicFile from '../musica/TropicalContact.mp3';

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
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',  // Cambiado de right a left
                    padding: '15px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'gold',
                    cursor: 'pointer',
                    boxShadow: '0 0 15px gold',
                    fontSize: '20px',
                    zIndex: 999,
                }}
                title="Reproducir / Pausar música"
            >
                {isPlaying ? '🔇' : '🎵'}
            </button>
        </>
    );
}
