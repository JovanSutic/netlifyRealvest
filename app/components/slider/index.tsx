import { ChangeEvent } from "react";

const Slider = ({
  onChange,
  title,
  min,
  max,
  step,
  value,
  options,
}: {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  title?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  options: string[];
}) => {
  const getMyStyle = (index: number) => {
    if (index === 0) return "start-0";
    if (index === options.length - 1) return "end-0";

    return `start-${index}/${
      options.length - 1
    } -translate-x-1/2 rtl:translate-x-1/2`;
  };

  return (
    <div className="relative">
      <label htmlFor="labels-range-input" className="sr-only">
        {title}
      </label>
      <input
        id="labels-range-input"
        type="range"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      {options.map((item, index) => {
        return (
          <span
            key={item}
            className={`text-sm text-gray-500 dark:text-gray-400 absolute ${getMyStyle(
              index
            )} -bottom-6`}
          >
            {item}
          </span>
        );
      })}
    </div>
  );
};

export default Slider;
