import React, { useEffect, useRef, useState } from "react";
import { useRive } from "@rive-app/react-canvas";

interface Viseme {
  phoneme: string;
  start_time_ms: number;
  end_time_ms: number;
  viseme_id: number;
  viseme_shape: string;
}

const BallAnimation = () => {
  const [visemeData, setVisemeData] = useState<Viseme[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { rive, RiveComponent } = useRive({
    src: "/face.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  // Load viseme data
  useEffect(() => {
    fetch("/visemes.json")
      .then((response) => response.json())
      .then((data) => setVisemeData(data))
      .catch((error) => console.error("Error loading visemes:", error));

    // Add audio ended event listener
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setCurrentIndex(0);
      });
    }

    // Cleanup
    return () => {
      if (audio) {
        audio.removeEventListener("ended", () => {
          setIsPlaying(false);
          setCurrentIndex(0);
        });
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !rive || !visemeData.length) return;

    const inputs = rive.stateMachineInputs("State Machine 1");
    
    const animationInterval = setInterval(() => {
      if (currentIndex >= visemeData.length) {
        setIsPlaying(false);
        audioRef.current?.pause();
        return;
      }

      const currentViseme = visemeData[currentIndex];
      console.log("Current viseme:", currentViseme);

      // Reset all triggers first
      inputs.forEach(input => {
        if (input.type === "trigger") {
          input.value = false;
        }
      });

      // Trigger animation based on viseme_shape
      const trigger = inputs.find(i => i.name === currentViseme.viseme_shape);
      if (trigger) {
        console.log("Triggering:", currentViseme.viseme_shape);
        trigger.fire();
      }

      setCurrentIndex(prev => prev + 1);
    }, 100); // Adjust timing as needed

    return () => clearInterval(animationInterval);
  }, [isPlaying, currentIndex, rive, visemeData]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setCurrentIndex(0); // Reset to start when playing
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const resetToIdle = () => {
    if (!rive) return;
    
    const inputs = rive.stateMachineInputs("State Machine 1");
    
    // Reset all triggers
    inputs.forEach(input => {
      if (input.type === "trigger") {
        input.value = false;
      }
    });

    // Fire the idle trigger
    const idleTrigger = inputs.find(i => i.name === "Idle");
    if (idleTrigger) {
      idleTrigger.fire();
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#333c37" }}>
      <div style={{ width: "300px", height: "300px", margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", backgroundColor: "#333c37" }}>
        <RiveComponent 
          onMouseLeave={resetToIdle}
        />
        <button
          onClick={handlePlayPause}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <audio ref={audioRef} src="/audio.wav" />
      </div>
    </div>
  );
};

export default BallAnimation;
