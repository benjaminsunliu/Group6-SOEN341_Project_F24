import React, { useEffect, useRef } from "react";

const ChillMusicPlayer = ({ shouldPlay }) => {
  const audio = useRef(new Audio("/audio/HinokiWood.mp3")).current;

  // Set the volume
  audio.volume = 0.1;

  useEffect(() => {
    const playAudio = async () => {
      try {
        if (shouldPlay && audio.paused) {
          await audio.play();
        } else if (!shouldPlay && !audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error playing audio: ", error);
        }
      }
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [shouldPlay, audio]);

  return null;
};

export default ChillMusicPlayer;
