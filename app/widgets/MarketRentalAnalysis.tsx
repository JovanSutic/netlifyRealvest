import { useEffect, useState } from "react";
import { makeNumberCurrency } from "../utils/numbers";
import {
  getNumberWithDecimals,
  getPropertyPurchaseExpenses,
} from "../utils/market";
import { LangType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import Tooltip from "../components/tooltip/Tooltip";
import { MarketSingleType } from "../types/market.types";

const calculateCapRate = (noi: number, marketValue: number): number => {
  if (marketValue === 0) {
    throw new Error("Market value cannot be zero.");
  }
  return (noi / marketValue) * 100;
};

const MarketRentalAnalysis = ({
  data,
  price,
  lang,
  isMobile,
}: {
  data: MarketSingleType;
  price: number;
  lang: LangType;
  isMobile: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const translate = new Translator("market");
  const netIncome = data.profit.average_rental * data.size * 12;
  const expenses = getPropertyPurchaseExpenses(data.price, data.details).total;
  const optimization =
    ((data.profit.max_rental - data.profit.average_rental) /
      data.profit.average_rental) *
    100;

  useEffect(() => {
    setOpen(!isMobile);
  }, []);

  if (data.profit.rental_count < 3) {
    return (
      <div className="w-full h-full flex flex-col justify-center py-3">
        <h3 className="text-center text-md text-gray-700">
          {translate.getTranslation(lang, "rentalNoData")}
        </h3>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div
          className={`w-full flex flex-column justify-between ${
            isMobile ? "mb-2" : "mb-4"
          }`}
        >
          <h3 className="text-lg text-center font-semibold">
            {translate.getTranslation(lang, "rentalTitle")}
          </h3>
          <div className="w-[30px]">
            <Tooltip
              text={translate.getTranslation(lang, "rentalText")}
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
            <button
              className="text-md text-blue-500 underline"
              onClick={() => setOpen(!open)}
            >{`${translate.getTranslation(
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
                <div className="w-[80%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "rentalAverage"
                  )}:`}</p>
                </div>
                <div className="w-[20%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(data.profit.average_rental)}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[80%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "appreciationSize"
                  )}:`}</p>
                </div>
                <div className="w-[20%]">
                  <p className="font-bold text-sm">{`${data.size}m2`}</p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[80%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "rentalMonth"
                  )}:`}</p>
                </div>
                <div className="w-[20%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(data.profit.average_rental * data.size)}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[80%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "rentalNoi"
                  )}:`}</p>
                </div>
                <div className="w-[20%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(netIncome)}
                  </p>
                </div>
              </div>
            </li>

            <hr className="text-gray-600 bg-gray-600 h-[1px] mt-2" />

            <li className="mt-2">
              <div className="flex w-full px-2 py-1">
                <div className="w-[80%]">
                  <p className="text-md font-semibold">{`${translate.getTranslation(
                    lang,
                    "rentalCap"
                  )}:`}</p>
                </div>
                <div className="w-[20%]">
                  <p className="font-bold text-md text-blue-500">
                    {`${getNumberWithDecimals(
                      calculateCapRate(netIncome, price),
                      2
                    )}%`}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[80%]">
                  <p className="text-md font-semibold">{`${translate.getTranslation(
                    lang,
                    "rentalPeriod"
                  )}:`}</p>
                </div>
                <div className="w-[20%]">
                  <p className="font-bold text-md text-blue-500">
                    {`${getNumberWithDecimals(
                      (price + expenses) / netIncome,
                      1
                    )}`}
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-2">
              <div className="flex w-full px-2 py-1">
                <div className="w-[80%]">
                  <p className="text-sm">{`${translate.getTranslation(
                    lang,
                    "rentalOptimization"
                  )}:`}</p>
                </div>
                <div className="w-[20%]">
                  <p className="font-bold text-sm">
                    {`${getNumberWithDecimals(optimization, 2)}%`}
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

export default MarketRentalAnalysis;
