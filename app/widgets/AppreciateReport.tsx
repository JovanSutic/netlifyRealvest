import { useState } from "react";
import {
  AppreciationData,
  LangType,
  PropertyType,
} from "../types/dashboard.types";
import { makeNumberCurrency } from "../utils/numbers";
import { Translator } from "../data/language/translator";
import Tooltip from "../components/tooltip/Tooltip";

const AppreciateReport = ({
  appreciationData = null,
  lang,
  range,
  type,
  isData,
  point,
}: {
  lang: LangType;
  appreciationData?: AppreciationData | null;
  range: string;
  type: PropertyType;
  isData: boolean;
  point: boolean;
}) => {
  const [appreciateTime, setAppreciateTime] = useState<5 | 10>(5);
  const translate = new Translator("dashboard");
  const presentationalSize: number = type === "parking" ? 14 : 50;

  const activeButton: string = "bg-white cursor-text";
  const activeTitle: string = "text-blue-600";
  const passiveTitle: string = "text-gray-300";
  const activeText: string = "text-gray-500";
  const passiveText: string = "text-gray-300";

  if (point && Number(range) > 500) {
    return (
      <div>
        <div className="flex flex-column w-full justify-center h-[200px]">
          <p className="flex items-center text-center text-slate-400 font-sm">
            {translate.getTranslation(lang, "bigAreaWarn")}
          </p>
        </div>
      </div>
    );
  }

  if (!point) {
    return (
      <div>
        <div className="flex flex-column w-full justify-center h-[200px]">
          <p className="flex items-center text-center text-slate-400 font-sm">
            {translate.getTranslation(lang, "areaNoDataAppreciate")}
          </p>
        </div>
      </div>
    );
  }

  if (appreciationData) {
    return (
      <div>
        <div className="w-full">
          <div className="w-full flex flex-row-reverse">
            <div className="w-[30px]">
              <Tooltip
                text={translate.getTranslation(lang, "infoAppreciate")}
                style="top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </Tooltip>
            </div>
          </div>
          <div>
            <div className="w-full flex border-grey-300 border-[1px] rounded-xl bg-gray-100">
              <div
                className={`w-[50%] rounded-s-xl py-3 px-1 flex gap-2 justify-around cursor-pointer ${
                  appreciateTime === 5 && activeButton
                }`}
                role="button"
                onKeyDown={() => null}
                tabIndex={0}
                onClick={() => setAppreciateTime(5)}
              >
                <p
                  className={`text-center text-2xl md:text-3xl font-bold mb-1 md:mb-3 ${
                    appreciateTime !== 5 ? passiveTitle : activeTitle
                  }`}
                >
                  {`+${Math.round(appreciationData.fiveYearPercent)}%`}
                </p>
                <div className="flex flex-col">
                  <p
                    className={`w-full text-center text-sm font-regular ${
                      appreciateTime !== 5 ? passiveText : activeText
                    }`}
                  >
                    {`${translate.getTranslation(lang, "priceGrowth")}`}
                  </p>
                  <p
                    className={`w-full text-center text-sm font-bold ${
                      appreciateTime !== 5 ? passiveText : activeText
                    }`}
                  >
                    {`${translate.getTranslation(lang, "forFive")}`}
                  </p>
                </div>
              </div>
              <div
                className={`w-[50%] rounded-e-xl py-3 px-1 flex gap-2 justify-around cursor-pointer ${
                  appreciateTime === 10 && activeButton
                }`}
                role="button"
                onKeyDown={() => null}
                tabIndex={0}
                onClick={() => setAppreciateTime(10)}
              >
                <p
                  className={`text-center text-2xl md:text-3xl font-bold mb-1 md:mb-3 ${
                    appreciateTime !== 10 ? passiveTitle : activeTitle
                  }`}
                >
                  {`+${Math.round(appreciationData.tenYearPercent)}%`}
                </p>
                <div className="flex flex-col">
                  <p
                    className={`w-full text-center text-sm font-regular ${
                      appreciateTime !== 10 ? passiveText : activeText
                    }`}
                  >
                    {`${translate.getTranslation(lang, "priceGrowth")}`}
                  </p>
                  <p
                    className={`w-full text-center text-sm font-bold ${
                      appreciateTime !== 10 ? passiveText : activeText
                    }`}
                  >
                    {`${translate.getTranslation(lang, "forTen")}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full mt-[-20px] pt-[10px]">
              <ul className=" border-solid border-x-[1px] border-b-[1px] rounded-b-xl border-gray-200 pt-3">
                <li>
                  <div className={`flex w-full px-2 py-1`}>
                    <div className="w-[75%]">
                      <p className="text-sm">
                        {`${translate.getTranslation(
                          lang,
                          "averagePriceFor"
                        )} ${appreciateTime} ${translate.getTranslation(
                          lang,
                          "years"
                        )}:`}
                      </p>
                    </div>
                    <div className="w-[25%]">
                      <p className="font-semibold text-sm text-right">
                        {makeNumberCurrency(
                          appreciateTime === 5
                            ? appreciationData.fiveYearPrice
                            : appreciationData.tenYearPrice
                        )}
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={`flex w-full px-2 py-1`}>
                    <div className="w-[75%]">
                      <p className="text-sm">
                        {translate.getTranslation(lang, "currentPrice")}
                      </p>
                    </div>
                    <div className="w-[25%]">
                      <p className="font-semibold text-sm text-right">
                        {makeNumberCurrency(appreciationData.lastAverage)}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="border-b-[1px] border-gray-200">
                  <div className={`flex w-full px-2 py-1 mb-1`}>
                    <div className="w-[75%]">
                      <p className="text-sm">
                        {translate.getTranslation(lang, "priceDiff")}
                      </p>
                    </div>
                    <div className="w-[25%]">
                      <p className="font-bold text-sm text-right text-blue-600">
                        {`+${makeNumberCurrency(
                          (appreciateTime === 5
                            ? appreciationData.fiveYearPrice
                            : appreciationData.tenYearPrice) -
                            appreciationData.lastAverage
                        )}`}
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={`flex w-full px-2 py-3`}>
                    <div className="w-[65%] md:w-[70%] lg:w-[75%]">
                      <p className="text-sm md:text-md font-bold">
                        {translate.getTranslation(
                          lang,
                          type === "parking"
                            ? "increaseExampleParking"
                            : "increaseExample"
                        )}
                      </p>
                    </div>
                    <div className="w-[35%] md:w-[30%] lg:w-[25%]">
                      <p className="font-bold text-md text-right text-blue-600">
                        {`+${makeNumberCurrency(
                          ((appreciateTime === 5
                            ? appreciationData.fiveYearPrice
                            : appreciationData.tenYearPrice) -
                            appreciationData.lastAverage) *
                            presentationalSize
                        )}`}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!appreciationData && isData) {
    return (
      <div>
        <div className="flex flex-column w-full justify-center h-[200px]">
          <p className="flex items-center text-center text-slate-400 font-sm">
            {translate.getTranslation(lang, "noAppreciateData")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-column w-full justify-center h-[200px]"></div>
    </div>
  );
};

export default AppreciateReport;
