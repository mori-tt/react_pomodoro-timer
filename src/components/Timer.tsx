import { Pause, Play, RefreshCcw } from "lucide-react";
import { useRef, useState } from "react";
import { ControlButton } from "./ControlButton";
import { ModeTypeButton } from "./ModeTypeButton";
import { TIMER_OPTIONS } from "../constants";

const Timer = () => {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [pausedTimeRemaining, setPausedTimeRemaining] = useState<number | null>(
    null
  );

  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  function handleStart() {
    // 後にAudio の設定を追加
    const currentTime = Date.now();
    if (!isRunning && pausedTimeRemaining) {
      setStartTime(currentTime - pausedTimeRemaining);
      setPausedTimeRemaining(null);
    } else {
      setStartTime(currentTime);
    }
    setNow(Date.now());
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    setIsRunning(true);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    if (startTime != null && now != null) {
      setPausedTimeRemaining(now - startTime);
    }
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    setStartTime(null);
    setNow(null);
    setIsRunning(false);
    setPausedTimeRemaining(null);
  }

  function handleChangeMode() {
    handleReset();
    setMode(mode === "work" ? "break" : "work");
  }

  // 経過時間(秒)
  const secondsPassed =
    startTime != null && now != null ? Math.floor((now - startTime) / 1000) : 0;
  // 残り時間の秒数（設定時間ー経過時間）
  const calculateTime = TIMER_OPTIONS[mode].minutes * 60 - secondsPassed;
  const displayMinutes = Math.floor(calculateTime / 60);
  const displaySeconds =
    calculateTime % 60 < 10 ? "0" + (calculateTime % 60) : calculateTime % 60;

  return (
    <div
      className={`flex justify-center rounded-xl p-4 bg-gradient-to-br w-[740px] mx-auto ${
        mode === "work"
          ? "from-amber-500 to-red-500"
          : "from-yellow-500 to-green-500"
      }`}
    >
      <div className="bg-zinc-700 space-y-12 rounded-xl w-full min-h-96 p-8">
        {/* モード切り替えボタン */}
        <div className="flex justify-center gap-4">
          {["work", "break"].map((modeType) => (
            <ModeTypeButton
              key={modeType}
              modeType={modeType as "work" | "break"}
              currentMode={mode}
              onClick={handleChangeMode}
            />
          ))}
        </div>

        <p className="text-center font-bold text-9xl font-mono text-zinc-100">
          {displayMinutes}:{displaySeconds}
        </p>

        {/* コントロールボタン */}
        <div className="flex gap-4 mb-6 justify-center">
          {!isRunning ? (
            <ControlButton onClick={handleStart} Icon={Play} />
          ) : (
            <ControlButton onClick={handleStop} Icon={Pause} />
          )}
          <ControlButton onClick={handleReset} Icon={RefreshCcw} />
        </div>
      </div>
    </div>
  );
};

export default Timer;
