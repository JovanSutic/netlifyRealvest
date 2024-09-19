import { DropdownOptions } from "../../types/component.types";

const ToggleButton = ({
  options,
  onChange,
  value,
}: {
  options: DropdownOptions[];
  onChange: (value: string) => void;
  value: string;
}) => {
    const orientation: string = options.findIndex(item => value === item.value) === 0 ? "left-1" : "right-1";
  return (
    <div className="shadow rounded border h-10 mt-4 flex p-1 relative items-center bg-gray-200">
      {options.map((item) => (
        <div key={item.value} className="w-full flex justify-center text-[12px] leading-[13px] text-gray-800 font-semibold px-4">
          <button onClick={() => onChange(item.value)}>{item.text}</button>
        </div>
      ))}
      <span className={`bg-white shadow text-gray-800 text-[13px] font-semibold flex items-center justify-center rounded px-3 h-8 transition-all top-[4px] max-w-[50%] leading-[14px] text-center absolute ${orientation}`}>
        {(options || []).find((item) => item.value === value)!.text}
      </span>
      {/* s */}
    </div>
  );
};

export default ToggleButton;
