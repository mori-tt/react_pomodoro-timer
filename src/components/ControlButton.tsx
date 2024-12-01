type ControlButtonProps = {
  onClick: () => void;
  Icon: React.ElementType;
};
export const ControlButton = (props: ControlButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition"
    >
      <props.Icon className="text-white" />
    </button>
  );
};
