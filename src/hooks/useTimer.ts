import { useEffect, useReducer, useRef } from "react";
import useAudio from "./useAudio";
import { TIMER_OPTIONS } from "../constants";

// アクションの型定義
type TimerAction =
  | { type: "START" }
  | { type: "STOP" }
  | { type: "RESET" }
  | { type: "UPDATE_TIME" }
  | { type: "CHANGE_MODE" };

// ステートの型定義
interface TimerState {
  mode: "work" | "break";
  isRunning: boolean;
  startTime: number | null;
  now: number | null;
  pausedTimeRemaining: number | null;
}

// 初期ステート
const initialState: TimerState = {
  mode: "work",
  isRunning: false,
  startTime: null,
  now: null,
  pausedTimeRemaining: null,
};

// リデューサー関数
function timerReducer(state: TimerState, action: TimerAction): TimerState {
  let currentTime;
  switch (action.type) {
    case "START":
      currentTime = Date.now();
      return {
        ...state,
        isRunning: true,
        startTime: state.pausedTimeRemaining
          ? currentTime - state.pausedTimeRemaining
          : currentTime,
        now: currentTime,
        pausedTimeRemaining: null,
      };

    case "STOP":
      return {
        ...state,
        isRunning: false,
        pausedTimeRemaining:
          state.startTime && state.now ? state.now - state.startTime : null,
      };

    case "RESET":
      return {
        ...state,
        startTime: null,
        now: null,
        isRunning: false,
        pausedTimeRemaining: null,
      };

    case "UPDATE_TIME":
      currentTime = Date.now();
      return {
        ...state,
        now: currentTime,
      };

    case "CHANGE_MODE":
      return {
        ...initialState,
        mode: state.mode === "work" ? "break" : "work",
      };

    default:
      return state;
  }
}

const useTimer = () => {
  // stateと、acton を指定する dispatch を返す
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { audioRef, playChime } = useAudio();

  // タイマー完了時の処理
  useEffect(() => {
    if (state.startTime && state.now) {
      const timePassed = state.now - state.startTime;
      const totalTime = TIMER_OPTIONS[state.mode].minutes * 60 * 1000;

      if (timePassed >= totalTime) {
        playChime();
        dispatch({ type: "CHANGE_MODE" });
        handleStart();
      }
    }
  }, [state.now, state.startTime, state.mode]);

  function handleStart() {
    if (audioRef.current) {
      audioRef.current.resume();
    }

    dispatch({ type: "START" });
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      dispatch({ type: "UPDATE_TIME" });
    }, 1000);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
    dispatch({ type: "STOP" });
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    dispatch({ type: "RESET" });
  }

  function handleChangeMode() {
    handleReset();
    dispatch({ type: "CHANGE_MODE" });
  }

  const secondsPassed =
    state.startTime && state.now
      ? Math.floor((state.now - state.startTime) / 1000)
      : 0;
  const calculateTime = TIMER_OPTIONS[state.mode].minutes * 60 - secondsPassed;
  const displayMinutes = Math.floor(calculateTime / 60);
  const displaySeconds =
    calculateTime % 60 < 10 ? "0" + (calculateTime % 60) : calculateTime % 60;

  return {
    state,
    handleStart,
    handleStop,
    handleReset,
    handleChangeMode,
    displayMinutes,
    displaySeconds,
  };
};

export default useTimer;
