import { useState } from "react";
import { PlanPeriodType, PlanType } from "../types/component.types";
import { LangType } from "../types/dashboard.types";
import ToggleButton from "../components/toggleButtons/ToggleButton";
import { Translator } from "../data/language/translator";
import { Link } from "@remix-run/react";

const PricingPlan = ({
  lang,
  options,
  toggle,
}: {
  lang: LangType;
  options: PlanType[];
  toggle: (plan: string) => void;
}) => {
  const [period, setPeriod] = useState<PlanPeriodType>("year");
  const translate = new Translator("components");

  return (
    <div className="max-w-7xl mx-auto mt-6 mb-10">
      <div className="text-center">
        <h2 className="text-gray-800 text-2xl xl:text-3xl font-bold">
          {translate.getTranslation(lang, "planTitle")}
        </h2>
      </div>

      <div className="w-full flex flex-row justify-center mt-6">
        <div className="flex">
          <ToggleButton
            value={period}
            onChange={(value) => setPeriod(value as PlanPeriodType)}
            options={[
              { text: translate.getTranslation(lang, "year"), value: "year" },
              { text: translate.getTranslation(lang, "month"), value: "month" },
            ]}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-8 max-sm:max-w-sm max-sm:mx-auto">
        {options.map((item) => (
          <div
            className={
              item.isActive
                ? "bg-blue-500 rounded-xl p-6 text-white shadow-lg shadow-blue-300"
                : "bg-white rounded-xl p-6"
            }
            key={item.name}
          >
            <h3
              className={`text-xl font-bold ${
                item.isActive ? "text-white" : "text-gray-800"
              }`}
            >
              {item.name}
            </h3>
            <p
              className={`text-sm italic ${
                item.isActive ? "text-white" : "text-gray-500"
              } mt-2`}
            >
              {item.description}
            </p>

            <div className="mt-6">
              <h2
                className={`text-4xl font-bold ${
                  item.isActive ? "text-white" : "text-gray-800"
                }`}
              >
                {period === "year" ? item.priceYear : item.priceMonth}
                <span
                  className={`text-sm font-medium ml-2 ${
                    item.isActive ? "text-white" : "text-gray-500"
                  }`}
                >
                  {`/${translate.getTranslation(lang, period)}`}
                </span>
              </h2>
              {item.link !== "" ? (
                <Link
                  to={item.link}
                  className={
                    item.isActive
                      ? "w-full block mt-6 px-4 py-2.5 text-sm text-center tracking-wide outline-none  border border-white text-white font-semibold bg-transparent rounded-md"
                      : "w-full block mt-6 px-4 py-2.5 text-sm text-center tracking-wide outline-none  border border-blue-500 text-blue-500 font-semibold bg-transparent rounded-md"
                  }
                >{translate.getTranslation(lang, "planButton")}</Link>
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(item.name)}
                  className={
                    item.isActive
                      ? "w-full mt-6 px-4 py-2.5 text-sm tracking-wide outline-none  border border-white text-white font-semibold bg-transparent rounded-md"
                      : "w-full mt-6 px-4 py-2.5 text-sm tracking-wide outline-none  border border-blue-500 text-blue-500 font-semibold bg-transparent rounded-md"
                  }
                >
                  {translate.getTranslation(lang, "planButton")}
                </button>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-base font-bold mb-4">{translate.getTranslation(lang, "planIncludes")}</h4>
              <ul className="space-y-4">
                {item.options.map((subItem) => (
                  <li
                    className="flex items-center text-sm"
                    key={subItem.name.replace(/\s/g, "")}
                  >
                    {subItem.active ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        className={`mr-4 ${
                          item.isActive ? "fill-white" : "fill-green-500"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        className={`mr-4 ${
                          item.isActive ? "fill-white" : "fill-red-500"
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {subItem.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlan;
