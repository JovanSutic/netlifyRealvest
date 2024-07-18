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
                className="bg-blue-500 text-sm font-medium rounded-s text-white px-1.5 py-1 border-solid border-t-[1px] border-b-[1px] border-l-[1px] border-blue-200"
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
              className="bg-slate-100 text-sm rounded-s font-medium hover:bg-slate-200 text-slate-700 px-1.5 py-1 border-solid border-t-[1px] border-b-[1px] border-l-[1px] border-blue-200"
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
                className="bg-blue-500 text-sm font-medium rounded-e text-white px-1.5 py-1 border-solid border-[1px] border-blue-200"
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
              className="bg-slate-100 text-sm rounded-e font-medium hover:bg-slate-200 text-slate-700 px-1.5 py-1  border-[1px] border-blue-200"
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
              className="bg-blue-500 text-sm font-medium text-white px-1.5 py-1 border-solid border-t-[1px] border-b-[1px] border-l-[1px] border-blue-200"
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
            className="bg-slate-100 text-sm font-medium hover:bg-slate-200 text-slate-700 px-1.5 py-1 border-solid border-t-[1px] border-b-[1px] border-l-[1px] border-blue-200"
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
