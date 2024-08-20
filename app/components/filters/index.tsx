import { RangeOption } from "../../utils/dateTime";
import { Translator } from "../../data/language/translator";
import {
  LangType,
  PropertyType,
  FiltersType,
} from "../../types/dashboard.types";
import Select from "../select/Select";
import { useEffect, useState } from "react";
import SideWrapper from "../helpers/SideWrapper";

const Filters = ({
  isOpen,
  lang,
  filters,
  toggleOpen,
  submit,
  mobile,
}: {
  isOpen: boolean;
  lang: LangType;
  filters: FiltersType;
  toggleOpen: () => void;
  submit: (filters: FiltersType) => void;
  mobile: boolean;
}) => {
  const translate = new Translator("dashboard");
  const reportTranslate = new Translator("report");

  const [range, setRange] = useState<string>("250");
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [timeRange, setTimeRange] = useState<RangeOption>("3m");

  const containerW = mobile ? "w-[100%]" : "w-[360px]";

  const isChanged =
    filters.propertyType !== propertyType ||
    filters.range !== range ||
    filters.timeRange !== timeRange
      ? true
      : false;

  useEffect(() => {
    if (range !== filters.range) setRange(filters.range);
    if (propertyType !== filters.propertyType)
      setPropertyType(filters.propertyType);
    if (timeRange !== filters.timeRange) setTimeRange(filters.timeRange);
  }, [isOpen]);

  return (
    <SideWrapper
      id="filtersMenu"
      open={isOpen}
      close={toggleOpen}
      mobile={mobile}
    >
      <ul>
        <li className="mb-6">
          <div className="flex flex-wrap items-center">
            <p className="w-full text-center font-bold text-xl mb-2 text-black">
              {translate.getTranslation(lang, "filters")}
            </p>
          </div>
          <hr />
        </li>

        <li className="px-2 mb-3">
          <div className="">
            <label
              htmlFor="mapCity"
              className="text-slate-800 ml-1 text-sm font-semibold"
            >
              {translate.getTranslation(lang, "timeRange")}
            </label>
            <Select
              name="timeRange"
              value={timeRange}
              isFullWidth={true}
              setValue={(value) => {
                setTimeRange(value as RangeOption);
              }}
              options={[
                {
                  value: "3m",
                  text: translate.getTranslation(lang, "3m"),
                },
                {
                  value: "6m",
                  text: translate.getTranslation(lang, "6m"),
                },
                {
                  value: "1y",
                  text: translate.getTranslation(lang, "1y"),
                },
                {
                  value: "3y",
                  text: translate.getTranslation(lang, "3y"),
                },
                {
                  value: "5y",
                  text: translate.getTranslation(lang, "5y"),
                },
              ]}
            />
          </div>
        </li>
        <li className="px-2 mb-3">
          <div className="">
            <label
              htmlFor="propertyType"
              className="text-slate-800 ml-1 text-sm font-semibold"
            >
              {translate.getTranslation(lang, "propertyType")}
            </label>
            <Select
              name="propertyType"
              value={propertyType!}
              isFullWidth={true}
              setValue={(value) => {
                setPropertyType(value as PropertyType);
              }}
              options={[
                {
                  value: "residential",
                  text: reportTranslate.getTranslation(
                    lang!,
                    "residentialType"
                  ),
                },
                {
                  value: "commercial",
                  text: reportTranslate.getTranslation(lang!, "commercialType"),
                },
                {
                  value: "parking",
                  text: reportTranslate.getTranslation(lang!, "parkingType"),
                },
              ]}
            />
          </div>
        </li>
        <li className="px-2 mb-5">
          <div className="">
            <div>
              <label
                htmlFor="mapCity"
                className="text-slate-800 ml-1 text-sm font-semibold"
              >
                {translate.getTranslation(lang, "areaRange")}
              </label>
              <div className="width-44">
                <Select
                  name="mapRange"
                  value={range}
                  isFullWidth={true}
                  setValue={(value) => {
                    setRange(value);
                  }}
                  options={[
                    {
                      value: "250",
                      text: `250 ${translate.getTranslation(lang, "meters")}`,
                    },
                    {
                      value: "500",
                      text: `500 ${translate.getTranslation(lang, "meters")}`,
                    },
                    {
                      value: "1000",
                      text: `1000 ${translate.getTranslation(lang, "meters")}`,
                    },
                    {
                      value: "1500",
                      text: `1500 ${translate.getTranslation(lang, "meters")}`,
                    },
                    {
                      value: "2000",
                      text: `2000 ${translate.getTranslation(lang, "meters")}`,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </li>
        <hr />
        <li className="px-2 mb-3 mt-3">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <label
                    htmlFor="sizeFrom"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {`${translate.getTranslation(
                      lang,
                      "size"
                    )} ${translate.getTranslation(lang, "from")}`}
                  </label>
                </div>
                <div className="w-full flex">
                  <label
                    htmlFor="sizeTo"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {translate.getTranslation(lang, "to")}
                  </label>
                </div>
              </div>

              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <Select
                    name="sizeFrom"
                    value={"0"}
                    isFullWidth={true}
                    setValue={(value) => {
                      console.log(value);
                    }}
                    options={[
                      {
                        value: "0",
                        text: `0`,
                      },
                      {
                        value: "30",
                        text: `30`,
                      },
                      {
                        value: "40",
                        text: `40`,
                      },
                      {
                        value: "50",
                        text: `50`,
                      },
                      {
                        value: "60",
                        text: `60`,
                      },
                    ]}
                  />
                </div>
                <div className="w-full flex">
                  <Select
                    name="sizeTo"
                    value={"0"}
                    isFullWidth={true}
                    setValue={(value) => {
                      console.log(value);
                    }}
                    options={[
                      {
                        value: "0",
                        text: `0`,
                      },
                      {
                        value: "30",
                        text: `30`,
                      },
                      {
                        value: "40",
                        text: `40`,
                      },
                      {
                        value: "50",
                        text: `50`,
                      },
                      {
                        value: "60",
                        text: `60`,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </li>
        <li className="px-2 mb-3">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <label
                    htmlFor="priceFrom"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {`${translate.getTranslation(
                      lang,
                      "price"
                    )} ${translate.getTranslation(lang, "from")}`}
                  </label>
                </div>
                <div className="w-full flex">
                  <label
                    htmlFor="priceTo"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {translate.getTranslation(lang, "to")}
                  </label>
                </div>
              </div>

              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <Select
                    name="priceFrom"
                    value={"0"}
                    isFullWidth={true}
                    setValue={(value) => {
                      console.log(value);
                    }}
                    options={[
                      {
                        value: "0",
                        text: `0`,
                      },
                      {
                        value: "30",
                        text: `30`,
                      },
                      {
                        value: "40",
                        text: `40`,
                      },
                      {
                        value: "50",
                        text: `50`,
                      },
                      {
                        value: "60",
                        text: `60`,
                      },
                    ]}
                  />
                </div>
                <div className="w-full flex">
                  <Select
                    name="priceTo"
                    value={"0"}
                    isFullWidth={true}
                    setValue={(value) => {
                      console.log(value);
                    }}
                    options={[
                      {
                        value: "0",
                        text: `0`,
                      },
                      {
                        value: "30",
                        text: `30`,
                      },
                      {
                        value: "40",
                        text: `40`,
                      },
                      {
                        value: "50",
                        text: `50`,
                      },
                      {
                        value: "60",
                        text: `60`,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </li>

        <li className={`fixed bottom-[40px] right-0 ${containerW}`}>
          <div className="w-full flex flex-row justify-center gap-8 px-2 py-3">
            <button
              onClick={() =>
                submit({
                  range,
                  timeRange,
                  propertyType,
                })
              }
              disabled={!isChanged}
              className="text-md px-6 py-2 bg-blue-400 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-blue-600 focus:outline-none disabled:bg-gray-300 disabled:cursor-no-drop"
            >
              {translate.getTranslation(lang, "apply")}
            </button>
            <button
              onClick={toggleOpen}
              className="text-md px-6 py-2 bg-gray-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-gray-700 focus:outline-none "
            >
              {translate.getTranslation(lang, "close")}
            </button>
          </div>
        </li>
      </ul>
    </SideWrapper>
  );
};

export default Filters;
