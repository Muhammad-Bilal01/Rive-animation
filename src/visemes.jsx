import React, { useEffect, useRef, useState } from "react";
import { useRive } from "@rive-app/react-canvas";

const RiveAnimation = () => {
  const audioRef = useRef(null);
  const [phonemeData, setPhonemeData] = useState([]);
  const [currentPhoneme, setCurrentPhoneme] = useState(null);
  const [play, setPlay] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: "/billoo.riv",
    stateMachines: "Mouth State Machine",
    autoplay: true,
  });

  useEffect(() => {
    // Fetch viseme data from visemes.json
    fetch("/visemes.json")
      .then((response) => response.json())
      .then((data) => setPhonemeData(data))
      .catch((error) => console.error("Error loading visemes:", error));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || phonemeData.length === 0) return;

    const updateMouthState = () => {
      const currentTimeMs = audio.currentTime * 1000;
      //   console.log(currentTimeMs);

      const activePhoneme = phonemeData.find(
        (phoneme) =>
          currentTimeMs >= phoneme.start_time_ms &&
          currentTimeMs < phoneme.end_time_ms
      );

      //   if (activePhoneme && activePhoneme !== currentPhoneme) {
      //     setCurrentPhoneme(activePhoneme);
      console.log(activePhoneme);

      //     // triggerMouthState(activePhoneme.viseme_shape);
      //   }
    };

    audio.addEventListener("timeupdate", updateMouthState);
    return () => audio.removeEventListener("timeupdate", updateMouthState);
  }, [currentPhoneme, phonemeData]);

  const triggerMouthState = (visemeShape) => {
    console.log("Shape:", visemeShape);

    if (!rive) return;

    const stateMachineInputs = rive.stateMachineInputs("Mouth State Machine");
    // stateMachineInputs.forEach((input) => {
    //   console.log("Name", input.name);
    //   input.value = false;
    // });

    const trigger = stateMachineInputs.find(
      (input) => input.name === visemeShape
    );
    if (trigger) {
      trigger.fire();
    } else {
      console.log("Not Trigger");
    }
  };

  const playAudioWithAnimation = () => {
    if (!rive || !audioRef.current) return;
    setCurrentPhoneme(null);
    setPlay(true);
    audioRef.current.play();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <div style={{ width: "300px", height: "300px", margin: "auto" }}>
        <RiveComponent />
      </div>
      <button
        onClick={playAudioWithAnimation}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Play
      </button>
      <audio ref={audioRef} src="/audio.wav" />
    </div>
  );
};

export default RiveAnimation;
