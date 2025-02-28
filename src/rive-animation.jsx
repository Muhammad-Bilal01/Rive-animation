import React, { useEffect, useRef, useState } from "react";
import { useRive, RiveComponent } from "@rive-app/react-canvas";

const RocketAnimation = () => {
  const [buttonText, setButtonText] = useState("Upload File");
  const [bgColor, setBgColor] = useState("white");
  const btnRef = useRef(null);

  const { rive, RiveComponent } = useRive({
    src: "/rocket-animation.riv", // Ensure this path is correct
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  useEffect(() => {
    if (rive) {
      const inputs = rive.stateMachineInputs("State Machine 1");
      const trigger = inputs.find((i) => i.name === "Trigger 1");

      if (btnRef.current && trigger) {
        btnRef.current.onclick = () => trigger.fire();
      }

      rive.onStateChange = (state) => {
        const currentState = state.data[0];

        if (currentState === "right-rotate" || currentState === "flying") {
          setBgColor("black");
          setButtonText("Uploading...");
        } else if (currentState === "rotate-left") {
          setBgColor("rgb(0, 153, 255)");
          setButtonText("Finished!");
        } else if (currentState === "Idle") {
          setTimeout(() => setButtonText("Upload File"), 1000);
        }
      };
    }
  }, [rive]);

  return (
    <div
      className="container"
      style={{ backgroundColor: bgColor, textAlign: "center", padding: "20px" }}
    >
      <div style={{ width: "500px", height: "500px", margin: "0 auto" }}>
        <RiveComponent />
      </div>
      <button
        ref={btnRef}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default RocketAnimation;
