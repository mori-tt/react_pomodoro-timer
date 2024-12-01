import { TIMER_OPTIONS } from "../constants";

type ModeTypeButtonProps = {
  modeType: "work" | "break";
  currentMode: "work" | "break";
  onClick: () => void;
};

export const ModeTypeButton = (props: ModeTypeButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`text-3xl h-16 w-16 rounded-full flex justify-center items-center hover:bg-zinc-700 ${
        props.currentMode === props.modeType ? "border" : ""
      }`}
    >
      {TIMER_OPTIONS[props.modeType].label}
    </button>
  );
};
