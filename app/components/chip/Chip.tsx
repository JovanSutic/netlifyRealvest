const ChipTab = ({
  text,
  active,
  onClick,
}: {
  text: string;
  active: boolean;
  onClick: () => void;
}) => {
  const background: string = active ? "bg-blue-500" : "bg-gray-200";
  const font: string = active ? "text-white" : "text-gray-400";
  const cursor: string = active ? "cursor-text" : "cursor-pointer";
  return (
    <div
      role="button"
      onKeyDown={() => null}
      tabIndex={0}
      className={`center relative inline-block select-none whitespace-nowrap rounded-lg ${background} py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none ${font} ${cursor}`}
      onClick={onClick}
    >
      <div className="mt-px">{text}</div>
    </div>
  );
};

export default ChipTab;
