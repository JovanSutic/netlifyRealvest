import { makeNumberCurrency } from "../utils/numbers";
import {
  getNumberWithDecimals,
  getPropertyPurchaseExpenses,
} from "../utils/market";
import { LangType, RoleType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import Tooltip from "../components/tooltip/Tooltip";
import { MarketSingleType } from "../types/market.types";
import Premium from "../components/placeholder/Premium";

const calculateCapRate = (noi: number, marketValue: number): number => {
  if (marketValue === 0) {
    throw new Error("Market value cannot be zero.");
  }
  return (noi / marketValue) * 100;
};

const getOccupancy = (occupancy: number) => {
  const base = Math.ceil(getNumberWithDecimals(occupancy || 0, 2) * 10) / 10;

  if (base < 0.1) return 0.1;
  if (base > 0.85) return getNumberWithDecimals(base * 0.8, 2);
  if (base > 0.6) return base;
  if (base > 0.5) return getNumberWithDecimals(base * 1.1, 2);
  if (base > 0.4) return getNumberWithDecimals(base * 1.15, 2);
  if (base > 0.3) return getNumberWithDecimals(base * 1.2, 2);
  if (base > 0.2) return getNumberWithDecimals(base * 1.3, 2);
  if (base > 0.1) return getNumberWithDecimals(base * 1.35, 2);

  return base;
};

const MarketRentalAnalysis = ({
  data,
  price,
  lang,
  isMobile,
  role,
}: {
  data: MarketSingleType;
  price: number;
  lang: LangType;
  isMobile: boolean;
  role: RoleType;
}) => {
  const translate = new Translator("market");
  const dashTranslate = new Translator("dashboard");
  const estimatedOccupancy = getOccupancy(data.short?.occupancyLevel || 0);

  const netIncome = data.profit.average_rental * data.size * 12;
  const expenses = getPropertyPurchaseExpenses(data.price, data.details).total;
  const optimization =
    (data.profit.max_rental - data.profit.average_rental) /
    data.profit.average_rental;

  if (role !== "admin" && role !== "limitedPremium") {
    return (
      <div className="w-full h-full flex flex-col">
        <div
          className={`w-full flex flex-column justify-between ${
            isMobile ? "mb-2" : "mb-4"
          }`}
        >
          <h3 className="text-[22px] md:text-lg font-bold">
            {translate.getTranslation(lang, "rentalTitle")}
          </h3>
        </div>
        <Premium
          lang={lang}
          title={dashTranslate.getTranslation(lang, "premiumSubtitle")}
          subTitle={dashTranslate.getTranslation(lang, "premiumSmallSubtitle")}
          button={dashTranslate.getTranslation(lang, "premiumButton")}
        />
      </div>
    );
  }

  if (data.profit.rental_count < 2) {
    return (
      <div className="w-full h-full flex flex-col">
        <div
          className={`w-full flex flex-column justify-between ${
            isMobile ? "mb-2" : "mb-4"
          }`}
        >
          <h3 className="text-[22px] md:text-lg font-bold">
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
        <div className="mt-2 md:mt-4 lg:mt-6">
          <h3 className="text-center text-md text-gray-700">
            {translate.getTranslation(lang, "rentalNoData")}
          </h3>
        </div>
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
          <h3 className="text-[22px] md:text-lg font-bold">
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
      </div>

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
          <li className="mt-2 mb-2">
            <div className="flex w-full px-2 py-1">
              <div className="w-[80%]">
                <p className="text-sm">{`${translate.getTranslation(
                  lang,
                  "rentalOptimization"
                )}:`}</p>
              </div>
              <div className="w-[20%]">
                <p className="font-bold text-sm">
                  {`${getNumberWithDecimals(
                    optimization > 0.3 ? 0.3 * 100 : optimization * 100,
                    2
                  )}%`}
                </p>
              </div>
            </div>
          </li>

          <hr />
          {data.short?.price ? (
            <>
              <li className="mt-2">
                <div className="flex w-full px-2 py-1">
                  <div className="w-[80%]">
                    <p className="text-sm">{`${translate.getTranslation(
                      lang,
                      "shortPrice"
                    )}:`}</p>
                  </div>
                  <div className="w-[20%]">
                    <p className="font-bold text-sm">
                      {`${makeNumberCurrency(data.short.price)}`}
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex w-full px-2 py-1">
                  <div className="w-[80%]">
                    <p className="text-sm">{`${translate.getTranslation(
                      lang,
                      "shortOccupancy"
                    )}:`}</p>
                  </div>
                  <div className="w-[20%]">
                    <p className="font-bold text-sm">
                      {`${estimatedOccupancy * 100}%`}
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex w-full px-2 py-1">
                  <div className="w-[80%]">
                    <p className="text-sm font-semibold">{`${translate.getTranslation(
                      lang,
                      "shortIncome"
                    )}:`}</p>
                  </div>
                  <div className="w-[20%]">
                    <p className="font-bold text-sm text-blue-500">
                      {`${makeNumberCurrency(
                        data.short.price * 30 * estimatedOccupancy
                      )}`}
                    </p>
                  </div>
                </div>
              </li>
            </>
          ) : (
            <div className="py-3">
              <p className="text-center text-md text-gray-500">
                {translate.getTranslation(lang, "shortNoData")}
              </p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MarketRentalAnalysis;
