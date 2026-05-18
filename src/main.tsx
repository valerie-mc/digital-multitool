import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Pomodoro } from "./Pomodoro";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Pomodoro />
  </React.StrictMode>,
);
