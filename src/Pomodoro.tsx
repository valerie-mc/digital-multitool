import { useState, useEffect } from "react";
import "./Pomodoro.css";

// Time is in milliseconds
const defaultData = {
  pmdr_duration: "150000", // 25 mins
  break_duration: "30000", // 5 mins
  short_and_long_break: "0",   // false
  short_break_duration: "30000", // 5 mins
  long_break_duration: "60000",  // 10 mins
}

enum TimerState {
  Playing = "PLAYING",
  Paused = "PAUSED",
}

// * Note: The string values of `TimerType` are correlated with the keys of `defaultData`.
// *       Going forward, please ensure this remains true.
enum TimerType {
  PMDR = "PMDR",
  Break = "BREAK",
  ShortBreak = "SHORT_BREAK",
  LongBreak = "LONG_BREAK",
}

function Pomodoro() {
  // Duration is the length the timer will run for (dependent on its state)
  function getCurrentDuration() {
    const key = timerType.toLowerCase() + "_duration";
    return Number(localStorage.getItem(key));
  }

  function alarm() {
    setTimerState(TimerState.Paused);
    console.log("Alarm Rang");
  }

  // TODO: Convert from millis to nice format


  // TODO: Convert from text input / nice format to millis


  // Initializes localStorage data
  for (const [key, value] of Object.entries(defaultData)) {
    if (localStorage.getItem(key.toString()) === null) {
      localStorage.setItem(key, value);
    }
  }

  const [timerState, setTimerState] = useState<TimerState>(TimerState.Paused)
  const [timerType, setTimerType] = useState<TimerType>(TimerType.PMDR);

  const [timer, setTimer] = useState(getCurrentDuration());
  const [referenceTime, setReferenceTime] = useState(Date.now());

  // For timer
  useEffect(() => {
    console.log("use effect");

    // TODO: Reference time needs to be updated if the timer is unpaused (otherwise leads to a big jump)
    if (timerState == TimerState.Paused) return;

    console.log("use effect running");

    // From: https://medium.com/@bsalwiczek/building-timer-in-react-its-not-as-simple-as-you-may-think-80e5f2648f9b
    const countdownUntilZero = () => {
      setTimer(prevTimer => {
        const now = Date.now();
        const interval = now - referenceTime;
        setReferenceTime(now);

        // Max ensures the timer doesn't go below zero which would cause two alarms
        return Math.max(prevTimer - interval, 0);
      });

      console.log(timer);

      if (timer <= 0) {
        alarm();
      }
    }

    setTimeout(countdownUntilZero, 100);
  }, [timerState, timer]);

  // For timerType
  useEffect(() => {
    setTimerState(TimerState.Paused);
    setTimer(getCurrentDuration());
  }, [timerType]);

  return (
    <main>
      <h2>{timerState}</h2>
      <h2>{timerType}</h2>
      <h2>{getCurrentDuration()}</h2>
      <h2>{timer}</h2>

      <button onClick={() => setTimerState(TimerState.Playing)}>Play</button>
      <button onClick={() => setTimerState(TimerState.Paused)}>Pause</button>
      <button onClick={() => setTimer(getCurrentDuration())}>Reset</button>
      <br></br>
      <button onClick={() => setTimerType(TimerType.PMDR)}>PDMR</button>
      <button onClick={() => setTimerType(TimerType.Break)}>Break</button>
      <button onClick={() => setTimerType(TimerType.ShortBreak)}>ShortBreak</button>
      <button onClick={() => setTimerType(TimerType.LongBreak)}>LongBreak</button>
      <br></br>
      <button onClick={() => localStorage.clear()}>Clear localStorage</button>
    </main>
  )
}

export { Pomodoro }

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

  // Other ideas:
  //   Total time elapsed
  //   Ability to manually set the timer time