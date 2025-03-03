import React, { useEffect, useState } from "react";
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
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isPlaying || !rive || !visemeData.length) return;

    const inputs = rive.stateMachineInputs("State Machine 1");
    
    const animationInterval = setInterval(() => {
      if (currentIndex >= visemeData.length) {
        setCurrentIndex(0); // Reset to start
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

      // Trigger appropriate animation based on viseme_id
      if (currentViseme.viseme_id < 7) {
        const leftRightTrigger = inputs.find(i => i.name === "Star");
        if (leftRightTrigger) {
          console.log("Triggering left-right");
          leftRightTrigger.fire();
        }
      }if (currentViseme.viseme_id > 7 && currentViseme.viseme_id < 10) {
        const leftRightTrigger = inputs.find(i => i.name === "Triangle");
        if (leftRightTrigger) {
          console.log("Triggering left-right");
          leftRightTrigger.fire();
        }
      } else {
        const increaseTrigger = inputs.find(i => i.name === "Polygon");
        if (increaseTrigger) {
          console.log("Triggering increase size");
          increaseTrigger.fire();
        }
      }

      setCurrentIndex(prev => prev + 1);
    }, 100); // Adjust timing as needed

    return () => clearInterval(animationInterval);
  }, [isPlaying, currentIndex, rive, visemeData]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      setCurrentIndex(0); // Reset to start when playing
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
    <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#313131" }}>
      <div style={{ width: "300px", height: "300px", margin: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", backgroundColor: "#313131" }}>
        <RiveComponent 
          onMouseLeave={resetToIdle}
        />
        <button
          onClick={handlePlayPause}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
};

export default BallAnimation;
