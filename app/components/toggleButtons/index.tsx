import { DropdownOptions } from "../../types/component.types";

const ToggleButtons = ({
  options,
  onChange,
  value,
}: {
  options: DropdownOptions[];
  onChange: (value: string) => void;
  value: string;
}) => {

  return (
    <div className="px-1">
      {options.map((option, index) => {
        if (index === 0) {
          if (option.value === value) {
            return (
              <button
                className="bg-indigo-900 font-medium rounded-s hover:bg-indigo-700 text-white px-1.5 py-1 border-solid border-t-[1px] border-b-[1px] border-l-[1px] border-indigo-900"
                onClick={() => {
                  onChange(option.value);
                }}
                key={option.value}
              >
                {option.text}
              </button>
            );
          }

          return (
            <button
              className="bg-indigo-100 rounded-s font-medium hover:bg-indigo-200 text-slate-700 px-1.5 py-1 border-solid border-t-[1px] border-b-[1px] border-l-[1px] border-indigo-900"
              onClick={() => {
                onChange(option.value);
              }}
              key={option.value}
            >
              {option.text}
            </button>
          );
        }

        if (index === options.length - 1) {
          if (option.value === value) {
            return (
              <button
                className="bg-indigo-900 font-medium rounded-e hover:bg-indigo-700 text-white px-1.5 py-1 border-solid border-[1px] border-indigo-900"
                onClick={() => {
                  onChange(option.value);
                }}
                key={option.value}
              >
                {option.text}
              </button>
            );
          }

          return (
            <button
              className="bg-indigo-100 rounded-e font-medium hover:bg-indigo-200 text-slate-700 px-1.5 py-1  border-[1px] border-indigo-900"
              onClick={() => {
                onChange(option.value);
              }}
              key={option.value}
            >
              {option.text}
            </button>
          );
        }

        if (option.value === value) {
          return (
            <button
              className="bg-indigo-900 font-medium hover:bg-indigo-700 text-white px-1.5 py-1 border-solid border-t-[1px] border-b-[1px] border-l-[1px] border-indigo-900"
              onClick={() => {
                onChange(option.value);
              }}
              key={option.value}
            >
              {option.text}
            </button>
          );
        }
        return (
          <button
            className="bg-indigo-100 font-medium hover:bg-indigo-200 text-slate-700 px-1.5 py-1 border-solid border-t-[1px] border-b-[1px] border-l-[1px] border-indigo-900"
            onClick={() => {
              onChange(option.value);
            }}
            key={option.value}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleButtons;
