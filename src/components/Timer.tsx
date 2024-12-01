import { Pause, Play, RefreshCcw } from "lucide-react";
import { ControlButton } from "./ControlButton";
import { ModeTypeButton } from "./ModeTypeButton";
import useTimer from "../hooks/useTimer";

const Timer = () => {
  const {
    state,
    displayMinutes,
    displaySeconds,
    handleStart,
    handleStop,
    handleReset,
    handleChangeMode,
  } = useTimer();

  const { mode, isRunning } = state;

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
