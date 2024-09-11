import { ChangeEvent, useEffect, useState } from "react";
import { makeNumberCurrency } from "../utils/numbers";
import {
  getNumberWithDecimals,
  getPropertyPurchaseExpenses,
} from "../utils/market";
import { calculateFuturePrice } from "../utils/dashboard";
import Slider from "../components/slider";
import { LangType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import Tooltip from "../components/tooltip/Tooltip";

const calculateIRR = (
  currentPrice: number,
  futurePrice: number,
  years: number
): number => {
  if (currentPrice <= 0 || futurePrice <= 0 || years <= 0) {
    throw new Error("All input values must be positive numbers.");
  }

  // Calculate the IRR using the compound annual growth rate formula
  const irrDecimal = Math.pow(futurePrice / currentPrice, 1 / years) - 1;

  // Convert to percentage
  return irrDecimal * 100;
};

const MarketAppreciationAnalysis = ({
  trend,
  price,
  size,
  average,
  lang,
  isMobile,
}: {
  trend: number;
  price: number;
  size: number;
  average: number;
  lang: LangType;
  isMobile: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const [years, setYears] = useState<number>(5);
  const translate = new Translator("market");

  useEffect(() => {
    setOpen(!isMobile)
  }, []);

  const changeStep = (event: ChangeEvent<HTMLInputElement>) => {
    setYears(Number(event.target.value));
  };
  return (
    <div>
      <div>
        <div className={`w-full flex flex-column justify-between ${isMobile ? 'mb-2' : 'mb-4'}`}>
          <h3 className="text-lg text-center font-semibold">
            {translate.getTranslation(lang, "appreciationTitle")}
          </h3>
          <div className="w-[30px]">
            <Tooltip
              text={translate.getTranslation(lang, "appreciationText")}
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
        {isMobile && (
          <div className="flex flex-row justify-center">
            <button className="text-md text-blue-500 underline" onClick={() => setOpen(!open)}>{`${translate.getTranslation(
              lang,
              open ? "seeLess" : "seeMore"
            )}`}</button>
          </div>
        )}
      </div>

      {open && (
        <div className="w-full mt-4">
          <ul>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "appreciationPrice"
                  )}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(average)}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "appreciationTrend"
                  )}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">{`${getNumberWithDecimals(
                    (trend || 0) * 100,
                    2
                  )}%`}</p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "appreciationSize"
                  )}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">{`${size}m2`}</p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "appreciationCurrent"
                  )}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(price)}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "appreciationExpenses"
                  )}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(
                      getPropertyPurchaseExpenses(price).total
                    )}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "price"
                  )} ${years} ${translate.getTranslation(lang, "years")}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(
                      calculateFuturePrice(average, trend, years) * size
                    )}
                  </p>
                </div>
              </div>
            </li>

            <li>
              <div className="w-full mt-2 mb-12 px-2">
                <Slider
                  min={5}
                  max={20}
                  step={5}
                  value={years}
                  title={translate.getTranslation(lang, "appreciationTitle")}
                  onChange={changeStep}
                  options={[
                    `5 ${translate.getTranslation(lang, "years")}`,
                    `10 ${translate.getTranslation(lang, "years")}`,
                    `15 ${translate.getTranslation(lang, "years")}`,
                    `20 ${translate.getTranslation(lang, "years")}`,
                  ]}
                />
              </div>
            </li>

            <hr className="text-gray-600 bg-gray-400 h-[1px] mt-2" />

            <li className="mt-2">
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-md font-semibold">{`${translate.getTranslation(
                    lang,
                    "profit"
                  )} ${years} ${translate.getTranslation(lang, "years")}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-md text-blue-500">
                    {makeNumberCurrency(
                      calculateFuturePrice(average, trend, years) * size -
                        (price + getPropertyPurchaseExpenses(price).total)
                    )}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-md font-semibold">{`${translate.getTranslation(
                    lang,
                    "appreciationIrr"
                  )}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-md text-blue-500">
                    {`${getNumberWithDecimals(
                      calculateIRR(
                        price + getPropertyPurchaseExpenses(price).total,
                        calculateFuturePrice(average, trend, years) * size,
                        years
                      ),
                      2
                    )}%`}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MarketAppreciationAnalysis;
