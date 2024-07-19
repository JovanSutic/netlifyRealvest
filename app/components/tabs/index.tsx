import { DropdownOptions } from "../../types/component.types";

const Tabs = ({
  options,
  value,
  onChange,
}: {
  options: DropdownOptions[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const gridMap = [
    "",
    "",
    "grid grid-cols-2 font-sans",
    "grid grid-cols-3 font-sans",
    "grid grid-cols-4 font-sans",
    "grid grid-cols-5 font-sans",
    "grid grid-cols-6 font-sans",
  ];
  const styleMap = {
    active:
      "text-slate-700 font-bold text-base text-center py-2 px-4 border-b-2 border-slate-700 cursor-pointer transition-all leading-5",
    regular:
      "text-slate-500 font-semibold text-base text-center hover:bg-gray-50 py-2 border-b-2 px-4 cursor-pointer transition-all leading-5",
  };
  return (
    <div>
      <ul className={gridMap[options.length]}>
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
