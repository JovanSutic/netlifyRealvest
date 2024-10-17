/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { AccordionData } from "../../types/component.types";

const Accordion = ({
  data,
  active,
  changeActive,
}: {
  data: AccordionData[];
  active: number;
  changeActive: (id: number) => void;
}) => {
  return (
    <div className="w-full font-[sans-serif] border divide-y rounded-lg overflow-hidden">
      {data.map((item) => (
        <div role="tab" key={item.title.replace(/\s/g, "")}>
          <button
            type="button"
            className="w-full text-sm font-semibold text-left py-6 px-6 text-blue-500 bg-white flex items-center transition-all"
            onClick={() => changeActive(active === item.id ? -1 : item.id)}
          >
            {active === item.id ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 fill-current mr-4 shrink-0"
                viewBox="0 0 124 124"
              >
                <path
                  d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                  data-original="#000000"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 fill-current mr-4 shrink-0"
                viewBox="0 0 512 512"
              >
                <path
                  d="M467 211H301V45c0-24.853-20.147-45-45-45s-45 20.147-45 45v166H45c-24.853 0-45 20.147-45 45s20.147 45 45 45h166v166c0 24.853 20.147 45 45 45s45-20.147 45-45V301h166c24.853 0 45-20.147 45-45s-20.147-45-45-45z"
                  data-original="#000000"
                />
              </svg>
            )}

            <span className="mr-8 text-xl xl:text-[20px] text-gray-700">{item.title}</span>
          </button>

          {active === item.id && (
            <div className="py-4 px-6 bg-gray-100">
              <p className="text:md xl:text-xl font-light text-gray-600">
                {item.text}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
