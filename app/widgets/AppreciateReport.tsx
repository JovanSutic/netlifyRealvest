import { useState } from "react";
import {
  AppreciationData,
  LangType,
  PropertyType,
} from "../types/dashboard.types";
import { makeNumberCurrency } from "../utils/numbers";
import { Translator } from "../data/language/translator";

const AppreciateReport = ({
  appreciationData = null,
  lang,
  range,
  type,
  isData,
}: {
  lang: LangType;
  appreciationData?: AppreciationData | null;
  range: string;
  type: PropertyType;
  isData: boolean;
}) => {
  const [appreciateTime, setAppreciateTime] = useState<5 | 10>(5);
  const translate = new Translator("dashboard");
  const presentationalSize: number = type === "parking" ? 14 : 50;

  const activeButton: string = "bg-white cursor-text";
  const activeTitle: string = "text-blue-600";
  const passiveTitle: string = "text-gray-300";
  const activeText: string = "text-gray-500";
  const passiveText: string = "text-gray-300";

  if (Number(range) > 500) {
    return (
      <div>
        <p className="text-center text-gray-400 text-sm font-medium py-4">
          {translate.getTranslation(lang, "bigAreaWarn")}
        </p>
      </div>
    );
  }

  if (appreciationData) {
    return (
      <div>
        <div className="w-full mb-6">
          <div>
            <div className="w-full flex border-grey-300 border-[1px] rounded-xl bg-gray-100">
              <div
                className={`w-[50%] rounded-s-xl py-3 cursor-pointer ${
                  appreciateTime === 5 && activeButton
                }`}
                role="button"
                onKeyDown={() => null}
                tabIndex={0}
                onClick={() => setAppreciateTime(5)}
              >
                <p
                  className={`w-full text-center text-2xl md:text-3xl font-bold mb-1 md:mb-3 ${
                    appreciateTime !== 5 ? passiveTitle : activeTitle
                  }`}
                >
                  {`+${Math.round(appreciationData.fiveYearPercent)}%`}
                </p>
                <p
                  className={`w-full text-center text-sm font-regular ${
                    appreciateTime !== 5 ? passiveText : activeText
                  }`}
                >
                  {translate.getTranslation(lang, "priceGrowth")}
                </p>
                <p
                  className={`w-full text-center text-sm md:text-md font-semibold ${
                    appreciateTime !== 5 ? passiveText : activeText
                  }`}
                >
                  {translate.getTranslation(lang, "forFive")}
                </p>
              </div>
              <div
                className={`w-[50%] rounded-e-xl py-3 cursor-pointer ${
                  appreciateTime === 10 && activeButton
                }`}
                role="button"
                onKeyDown={() => null}
                tabIndex={0}
                onClick={() => setAppreciateTime(10)}
              >
                <p
                  className={`w-full text-center text-2xl md:text-3xl font-bold mb-1 md:mb-3 ${
                    appreciateTime !== 10 ? passiveTitle : activeTitle
                  }`}
                >
                  {`+${Math.round(appreciationData.tenYearPercent)}%`}
                </p>
                <p
                  className={`w-full text-center text-sm font-regular ${
                    appreciateTime !== 10 ? passiveText : activeText
                  }`}
                >
                  {translate.getTranslation(lang, "priceGrowth")}
                </p>
                <p
                  className={`w-full text-center text-sm md:text-md font-semibold ${
                    appreciateTime !== 10 ? passiveText : activeText
                  }`}
                >
                  {translate.getTranslation(lang, "forTen")}
                </p>
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
        <p className="text-center text-red-300 text-md font-medium py-4">
          {translate.getTranslation(lang, "noAppreciateData")}
        </p>
      </div>
    );
  }

  return null;
};

export default AppreciateReport;
