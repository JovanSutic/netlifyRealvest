import { DropdownOptions } from "../../types/component.types";

const Tabs = ({
  options,
  rows = 1,
  value,
  onChange,
}: {
  options: DropdownOptions[];
  value: string;
  rows?: number;
  onChange: (value: string) => void;
}) => {
  const gridMap = {
    "2x1": "grid grid-cols-2 font-sans",
    "3x1": "grid grid-cols-3 font-sans",
    "4x1": "grid grid-cols-4 font-sans",
    "5x1": "grid grid-cols-5 font-sans",
    "6x1": "grid grid-cols-6 font-sans",
    "2x2": "grid grid-cols-2 grid-rows-2 font-sans",
    "3x2": "grid grid-cols-3 grid-rows-2 font-sans",
    "4x2": "grid grid-cols-4 grid-rows-2 font-sans",
    "5x2": "grid grid-cols-5 grid-rows-2 font-sans",
    "6x2": "grid grid-cols-6 grid-rows-2 font-sans",
  };
  const styleMap = {
    active:
      "text-slate-700 font-bold text-base text-center py-2 px-4 border-b-2 border-slate-700 cursor-pointer transition-all leading-5",
    regular:
      "text-slate-500 font-bold xl:font-semibold text-base text-center hover:bg-gray-50 py-2 border-b-2 px-4 cursor-pointer transition-all leading-5",
  };
  return (
    <div>
      <ul className={gridMap[`${Math.ceil(options.length / rows)}x${rows}` as keyof typeof gridMap]}>
        {options.map((item) => (
          <li
            key={item.value}
            className={
              item.value === value ? styleMap.active : styleMap.regular
            }
          >
            <button type="button" className="w-full h-full" onClick={() => onChange(item.value)}>
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
