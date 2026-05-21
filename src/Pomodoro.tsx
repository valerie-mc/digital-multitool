import { useState, useEffect, useRef } from "react";
import "./Pomodoro.css";

enum TimerState {
  Playing = "PLAYING",
  Paused = "PAUSED",
}

// * Note: The string values of `TimerType` are correlated with the keys of `defaultData`.
// *       Going forward, please ensure this remains true.
enum TimerType {
  Study = "STUDY",
  Break = "BREAK",
  ShortBreak = "SHORT_BREAK",
  LongBreak = "LONG_BREAK",
}

// Time is in milliseconds
const defaultData = {
  [TimerType.Study.toLowerCase()]: "1500000", // 25 mins
  [TimerType.Break.toLowerCase()]: "300000", // 5 mins
  [TimerType.ShortBreak.toLowerCase()]: "3000", // 5 mins
  [TimerType.LongBreak.toLowerCase()]: "600000",  // 10 mins
  short_and_long_break: "0",   // false
}


function formatTime(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const hours   = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const parts = [hours, mins, secs]
    .map((unit) => unit.toString().padStart(2, "0"));

  return hours > 0 ? parts.join(":") : parts.slice(1).join(":");
}

// From: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest function
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

  // TODO: Convert from millis to nice format
  // TODO: Convert from text input / nice format to millis


function Pomodoro() {
  function getCurrentDuration() {
    return Number(localStorage.getItem(timerType.toLowerCase()));
  }

  function handleAlarm() {
    if (!alarmRung) {
      console.log("Alarm Rang");
      alarmRung = true;
    }
  }

  function handlePlay() {
    if (timeLeft > 0) setTimerState(TimerState.Playing);
  }

  function handlePause() {
    setTimerState(TimerState.Paused);
    setReferenceTime(null);
  }

  function handleReset() {
    handlePause();
    setTimeLeft(getCurrentDuration());
    alarmRung = false;
  }

  function handleTypeSwitch(newType: TimerType) {
    if (newType === timerType) return;

    handlePause();
    setTimerType(newType);
    setTimeLeft(Number(localStorage.getItem(newType.toLowerCase())));
    alarmRung = false;
  }


  // Initializes localStorage data
  for (const [key, value] of Object.entries(defaultData)) {
    if (localStorage.getItem(key.toString()) === null) {
      localStorage.setItem(key, value);
    }
  }

  const [timerState, setTimerState] = useState<TimerState>(TimerState.Paused)
  const [timerType, setTimerType] = useState<TimerType>(TimerType.Study);

  const [timeLeft, setTimeLeft] = useState<number>(getCurrentDuration());
  const [referenceTime, setReferenceTime] = useState<number | null>(Date.now());

  // Used to prevent double alarms
  let alarmRung = false;

  // Timer behaviour
  useInterval(
    () => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handlePause();
          handleAlarm();
          return 0;
        }

        const now = Date.now();

        if (referenceTime === null) {
          setReferenceTime(now);
          return prev;
        } else {
          const interval = now - referenceTime;
          setReferenceTime(now);
          return Math.max(prev - interval, 0);
        }
      });
    },
    timerState === TimerState.Playing ? 50 : null
  );


  return (
    <main>
      <h2>{timerState}</h2>
      <h2>{timerType}</h2>
      <h2>{formatTime(getCurrentDuration())}</h2>
      <h2>{formatTime(timeLeft)}</h2>

      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleReset}>Reset</button>
      <br></br>
      <button onClick={() => handleTypeSwitch(TimerType.Study)}>PDMR</button>
      <button onClick={() => handleTypeSwitch(TimerType.Break)}>Break</button>
      <button onClick={() => handleTypeSwitch(TimerType.ShortBreak)}>ShortBreak</button>
      <button onClick={() => handleTypeSwitch(TimerType.LongBreak)}>LongBreak</button>
      <br></br>
      <button onClick={() => localStorage.clear()}>Clear localStorage</button>

      <br></br>
      <TimeInput onChange={(ms) => setTimeLeft(ms)} />
    </main>
  )
}


// From Cluade Ai
// "123456" → "12:34:56", "12345" → "1:23:45", "5" → "0:00:05"
function formatDigits(digits: string): string {
  const padded = digits.padStart(6, "0");
  const hh = padded.slice(0, 2);
  const mm = padded.slice(2, 4);
  const ss = padded.slice(4, 6);
  return `${parseInt(hh)}:${mm}:${ss}`; // parseInt strips leading zero from hours
}

function digitsToMs(digits: string): number {
  const padded = digits.padStart(6, "0");
  const hours   = parseInt(padded.slice(0, 2));
  const minutes = parseInt(padded.slice(2, 4));
  const seconds = parseInt(padded.slice(4, 6));
  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

function TimeInput({ onChange }: { onChange: (ms: number) => void }) {
  const [digits, setDigits] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
      .replace(/\D/g, "")  // strip non-digits
      .slice(-6);           // keep at most 6 digits (rightmost wins, like a calculator)

    setDigits(raw);
    onChange(digitsToMs(raw));
  }

  return (
    <input
      value={formatDigits(digits)}  // display formatted
      onChange={handleChange}
      placeholder="0:00:00"
    />
  );
}



export { Pomodoro };

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