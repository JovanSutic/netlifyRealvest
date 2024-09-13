import { useEffect, useState } from "react";
import { makeNumberCurrency } from "../utils/numbers";
import {
  getFlipProbability,
  getNumberWithDecimals,
  getPropertyPurchaseExpenses,
  getRenovationExpenses,
  isNewBuild,
} from "../utils/market";
import { LangType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import Tooltip from "../components/tooltip/Tooltip";
import { MarketSingleType } from "../types/market.types";



const MarketFlipAnalysis = ({
  data,
  price,
  average,
  lang,
  isMobile,
}: {
  data: MarketSingleType;
  price: number;
  average: number;
  lang: LangType;
  isMobile: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const translate = new Translator("market");

  const maxPrice = isNewBuild(data.details) && (data.profit.maxCompetition > (data.average_price! * 2.2)) ? data.profit.maxCompetition / 2 : data.profit.maxCompetition;
  const probability = getFlipProbability(data.details, data.room_ratio || 0.001);
  const renovationM2Price = getRenovationExpenses(data.details);
  const flipPrice = data.size * maxPrice * probability;
  const flipInvestment =
    data.size * renovationM2Price +
    price +
    getPropertyPurchaseExpenses(data.price, data.details).total;

  useEffect(() => {
    setOpen(!isMobile);
  }, []);

  return (
    <div>
      <div>
        <div
          className={`w-full flex flex-column justify-between ${
            isMobile ? "mb-2" : "mb-4"
          }`}
        >
          <h3 className="text-lg text-center font-semibold">
            {translate.getTranslation(lang, "flipTitle")}
          </h3>
          <div className="w-[30px]">
            <Tooltip
              text={translate.getTranslation(lang, "flipText")}
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
                    "appreciationCurrent"
                  )}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(data.price)}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">
                    {`${translate.getTranslation(
                      lang,
                      "appreciationExpenses"
                    )}:`}
                  </p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(
                      getPropertyPurchaseExpenses(data.price, data.details).total
                    )}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(lang, 'flipRenovation')}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(data.size * renovationM2Price)}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(lang, 'flipTotal')}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(flipInvestment)}
                  </p>
                </div>
              </div>
            </li>

            <hr className="text-gray-600 bg-gray-600 h-[1px] mt-2" />

            <li className="mt-2">
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(lang, 'flipMax')}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(maxPrice)}
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(lang, 'flipProbability')}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">{`${getNumberWithDecimals(probability*100, 0)}%`}</p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-sm">{`${translate.getTranslation(lang, 'flipPotential')}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className="font-bold text-sm">
                    {makeNumberCurrency(flipPrice)}
                  </p>
                </div>
              </div>
            </li>

            <hr className="text-gray-600 bg-gray-600 h-[1px] mt-2" />

            <li className="mt-2">
              <div className="flex w-full px-2 py-1">
                <div className="w-[75%]">
                  <p className="text-md font-semibold">{`${translate.getTranslation(lang, 'flipProfit')}:`}</p>
                </div>
                <div className="w-[25%]">
                  <p className={`font-bold text-md ${flipPrice - flipInvestment > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                    {makeNumberCurrency(flipPrice - flipInvestment)}
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

export default MarketFlipAnalysis;
