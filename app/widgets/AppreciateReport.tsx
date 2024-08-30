import { useState } from "react";
import {
  AppreciationData,
  LangType,
  PropertyType,
  RentEstimationData,
  RoleType,
} from "../types/dashboard.types";
import { makeNumberCurrency } from "../utils/numbers";
import { Translator } from "../data/language/translator";
import Tooltip from "../components/tooltip/Tooltip";
import { Link } from "@remix-run/react";

const AppreciateReport = ({
  appreciationData = null,
  rentalData = null,
  lang,
  range,
  type,
  isData,
  point,
  role,
}: {
  lang: LangType;
  appreciationData?: AppreciationData | null;
  rentalData?: RentEstimationData | null;
  range: string;
  type: PropertyType;
  isData: boolean;
  point: boolean;
  role: RoleType;
}) => {
  const [appreciateTime, setAppreciateTime] = useState<5 | 10>(5);
  const translate = new Translator("dashboard");
  const presentationalSize: number = type === "parking" ? 14 : 50;

  const activeButton: string = "bg-white cursor-text";
  const activeText: string = "text-blue-500";
  const passiveText: string = "text-gray-300";

  if (role !== "premium") {
    return (
      <div className="bg-[url('/blurred_table.jpg')] bg-contain bg-opacity-90">
        <div className="flex flex-col w-full justify-center h-[200px]">
          <div className="w-full flex justify-center mb-1">
            <p className="bg-white px-1 flex items-center text-center text-blue-500 text-xl font-bold">
              {translate.getTranslation(lang, "premiumTitle")}
            </p>
          </div>
          <div className="w-full flex justify-center mb-5">
            <p className="bg-white px-1 flex items-center text-center text-slate-400 text-sm">
              {translate.getTranslation(lang, "premiumSubtitle")}
            </p>
          </div>
          <div className="w-full flex justify-center">
            <Link to={`/plans?lang=${lang}`} className="text-md text-blue-950 px-6 py-2 bg-amber-300 font-semibold rounded-md transition-all duration-300 transform hover:bg-amber-400 focus:outline-none disabled:bg-gray-300 disabled:cursor-no-drop">
              {translate.getTranslation(lang, "premiumButton")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

  if (appreciationData || (rentalData?.count || 0) > 0) {
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
                className={`w-[50%] rounded-s-xl py-3 px-1 flex flex-col md:flex-row gap-2 justify-around cursor-pointer ${
                  appreciateTime === 5 && activeButton
                }`}
                role="button"
                onKeyDown={() => null}
                tabIndex={0}
                onClick={() => setAppreciateTime(5)}
              >
                <div className="flex flex-col">
                  <p
                    className={`w-full text-center text-xl font-bold ${
                      appreciateTime !== 5 ? passiveText : activeText
                    }`}
                  >
                    {`${translate.getTranslation(lang, "forFive")}`}
                  </p>
                </div>
              </div>
              <div
                className={`w-[50%] rounded-e-xl py-3 px-1 flex flex-col md:flex-row gap-2 justify-around cursor-pointer ${
                  appreciateTime === 10 && activeButton
                }`}
                role="button"
                onKeyDown={() => null}
                tabIndex={0}
                onClick={() => setAppreciateTime(10)}
              >
                <div className="flex flex-col">
                  <p
                    className={`w-full text-center text-xl font-bold ${
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
                {appreciationData ? (
                  <>
                    <li>
                      <div className={`flex w-full px-2 py-1`}>
                        <div className="w-full text-center">
                          <p className="text-[10px] font-bold text-gray-400">
                            {translate
                              .getTranslation(lang, "appreciateReportTitle")
                              .toUpperCase()}
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
                            {`${translate.getTranslation(
                              lang,
                              "priceDiff"
                            )} %:`}
                          </p>
                        </div>
                        <div className="w-[25%]">
                          <p className="font-bold text-sm text-right text-blue-600">
                            {`+${Math.round(
                              appreciateTime === 5
                                ? appreciationData.fiveYearPercent
                                : appreciationData.tenYearPercent
                            )}%`}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="border-b-[1px] border-gray-200">
                      <div className={`flex w-full px-2 py-1 mb-1`}>
                        <div className="w-[75%]">
                          <p className="text-sm">
                            {`${translate.getTranslation(
                              lang,
                              "priceDiff"
                            )} €:`}
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
                          <p className="text-sm md:text-md font-semibold">
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
                  </>
                ) : (
                  <li>
                    <div>
                      <div className="flex flex-column w-full justify-center h-[200px]">
                        <p className="flex items-center text-center text-slate-400 font-sm">
                          {translate.getTranslation(lang, "noDataAppreciate")}
                        </p>
                      </div>
                    </div>
                  </li>
                )}

                {type === "residential" &&
                rentalData &&
                (rentalData?.count || 0) > 4 ? (
                  <>
                    <li>
                      <div className={`flex w-full px-2 py-1`}>
                        <div className="w-full text-center">
                          <p className="text-[10px] font-bold text-gray-400">
                            {translate
                              .getTranslation(lang, "rentReportTitle")
                              .toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className={`flex w-full px-2 py-1`}>
                        <div className="w-[75%]">
                          <p className="text-sm">
                            {translate.getTranslation(lang, "averageRentalM2")}
                          </p>
                        </div>
                        <div className="w-[25%]">
                          <p className="font-semibold text-sm text-right">
                            {makeNumberCurrency(rentalData.average)}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="border-b-[1px] border-gray-200">
                      <div className={`flex w-full px-2 py-1`}>
                        <div className="w-[75%]">
                          <p className="text-sm">
                            {translate.getTranslation(lang, "rentalExpense")}
                          </p>
                        </div>
                        <div className="w-[25%]">
                          <p className="font-semibold text-sm text-right text-red-400">
                            {`-${makeNumberCurrency(rentalData.expense)}`}
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className={`flex w-full px-2 py-3`}>
                        <div className="w-[65%] md:w-[70%] lg:w-[75%]">
                          <p className="text-sm md:text-md font-semibold">
                            {translate.getTranslation(lang, "rentalExample")}
                          </p>
                        </div>
                        <div className="w-[35%] md:w-[30%] lg:w-[25%]">
                          <p className="font-bold text-md text-right text-blue-600">
                            {`+${makeNumberCurrency(
                              rentalData.average * 50 * 12 * appreciateTime -
                                rentalData.expense * 50 * appreciateTime
                            )}`}
                          </p>
                        </div>
                      </div>
                    </li>
                  </>
                ) : (
                  <li>
                    <div>
                      <div className="flex flex-column px-4 w-full justify-center h-[120px]">
                        <p className="flex items-center text-center text-slate-400 font-sm">
                          {translate.getTranslation(
                            lang,
                            type === "residential"
                              ? "noDataRental"
                              : "noDataRentalType"
                          )}
                        </p>
                      </div>
                    </div>
                  </li>
                )}
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
      <div>
        <div className="flex flex-column w-full justify-center h-[200px]">
          <p className="flex items-center text-center text-slate-400 font-sm">
            {translate.getTranslation(lang, "noDataAppreciateReport")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppreciateReport;
