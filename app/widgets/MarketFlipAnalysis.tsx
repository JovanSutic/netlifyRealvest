import { makeNumberCurrency } from "../utils/numbers";
import {
  getMarketItemImportantData,
  getMarketPriceIndex,
  getPropertyPurchaseExpenses,
} from "../utils/market";
import { LangType, RoleType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import Tooltip from "../components/tooltip/Tooltip";
import { MarketSingleType } from "../types/market.types";
import Premium from "../components/placeholder/Premium";
import PriceIndex from "../components/slider/PriceIndex";

const MarketFlipAnalysis = ({
  data,
  average,
  lang,
  isMobile,
  role,
}: {
  data: MarketSingleType;
  average: number;
  lang: LangType;
  isMobile: boolean;
  role: RoleType;
}) => {
  const translate = new Translator("market");
  const dashTranslate = new Translator("dashboard");

  const {
    probability,
    maxPrice,
    renovationM2Price,
    flipInvestment,
  } = getMarketItemImportantData(data);

  const flipPrice = data.size * maxPrice * probability;

  if (role !== "admin" && role !== "limitedPremium") {
    return (
      <div className="w-full h-full flex flex-col">
        <div
          className={`w-full flex flex-column justify-between ${
            isMobile ? "mb-2" : "mb-4"
          }`}
        >
          <h3 className="text-[22px] md:text-lg font-bold">
            {translate.getTranslation(lang, "flipTitle")}
          </h3>
        </div>
        <Premium
          lang={lang}
          subTitle={dashTranslate.getTranslation(lang, "premiumSmallSubtitle")}
          title={dashTranslate.getTranslation(lang, "premiumSubtitle")}
          button={dashTranslate.getTranslation(lang, "premiumButton")}
        />
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
      </div>

      <div className="w-full mt-4">
        <ul>
          <li>
            <div className="flex w-full px-2 py-1">
              <div className="w-[80%]">
                <p className="text-sm">{`${translate.getTranslation(
                  lang,
                  "appreciationPrice"
                )}:`}</p>
              </div>
              <div className="w-[20%]">
                <p className="font-bold text-sm">
                  {makeNumberCurrency(average)}
                </p>
              </div>
            </div>
          </li>

          <li>
            <div className="flex w-full px-2 py-1">
              <div className="w-[80%]">
                <p className="text-sm">{`${translate.getTranslation(
                  lang,
                  "appreciationCurrent"
                )}:`}</p>
              </div>
              <div className="w-[20%]">
                <p className="font-bold text-sm">
                  {makeNumberCurrency(data.price)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex w-full px-2 py-1">
              <div className="w-[80%]">
                <p className="text-sm">
                  {`${translate.getTranslation(lang, "appreciationExpenses")}:`}
                </p>
              </div>
              <div className="w-[20%]">
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
              <div className="w-[80%]">
                <p className="text-sm">{`${translate.getTranslation(
                  lang,
                  "flipRenovation"
                )}:`}</p>
              </div>
              <div className="w-[20%]">
                <p className="font-bold text-sm">
                  {makeNumberCurrency(data.size * renovationM2Price)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex w-full px-2 py-1">
              <div className="w-[80%]">
                <p className="text-sm">{`${translate.getTranslation(
                  lang,
                  "flipTotal"
                )}:`}</p>
              </div>
              <div className="w-[20%]">
                <p className="font-bold text-sm">
                  {makeNumberCurrency(flipInvestment)}
                </p>
              </div>
            </div>
          </li>

          <hr className="text-gray-600 bg-gray-600 h-[1px] mt-2" />

          <li className="mt-2">
            <div className="flex w-full px-2 py-1">
              <div className="w-[80%]">
                <p className="text-sm">{`${translate.getTranslation(
                  lang,
                  "flipMax"
                )}:`}</p>
              </div>
              <div className="w-[20%]">
                <p className="font-bold text-sm">
                  {makeNumberCurrency(maxPrice)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex w-full px-2 py-1">
              <div className="w-[80%]">
                <p className="text-sm">{`${translate.getTranslation(
                  lang,
                  "flipAverage"
                )}:`}</p>
              </div>
              <div className="w-[20%]">
                <p className="font-bold text-sm">
                  {makeNumberCurrency(data.profit.average_competition)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="flex w-full px-2 py-1">
              <div className="w-[80%]">
                <p className="text-sm">{`${translate.getTranslation(
                  lang,
                  "flipNewbuild"
                )}:`}</p>
              </div>
              <div className="w-[20%]">
                <p className="font-bold text-sm">
                  {makeNumberCurrency(
                    data.profit.competition_new_build_average
                  )}
                </p>
              </div>
            </div>
          </li>

          <li className="mt-3">
            <PriceIndex lang={lang} index={getMarketPriceIndex(flipPrice, flipInvestment)} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MarketFlipAnalysis;
