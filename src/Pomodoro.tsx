import { useState } from "react";
import "./Pomodoro.css";

function Pomodoro() {
  // TODO: Add persistant state for timer times

  // In seconds
  const [pmdrDuration, setPmdrDuration] = useState(50);
  const [breakDuration, setBreakDuration] = useState(15);

  const [pmdrTimer, setPmdrTimer] = useState(0);
  const [breakTimer, setBreakTimer] = useState(0);

  // Either "pmdr" or "break"
  const [timerType, setTimerType] = useState("pmdr");
  const [timer, setTimer] = useState(0);

  
  async function play() {}

  async function pause() {}


  // https://dev.to/yuridevat/how-to-create-a-timer-with-react-7b9

  // Buttons needed:
  //   Play / Pause
  //   Restart Timer
  //   Pmdr Timer
  //   Break Timer
  //   Move to next (aka. p->b and b->p)?

  // Fields needed:
  //   Pmdr duration
  //   Break duration

  return (
    <main>
      <h1>This is my Pomodoro App!</h1>

    </main>
  )
}

export { Pomodoro }
