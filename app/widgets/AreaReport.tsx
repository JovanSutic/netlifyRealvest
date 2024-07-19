import { makeNumberCurrency, roundNumberToDecimal } from "../utils/numbers";
import { AreaReportType, LangType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";

const AreaReport = ({
  data,
  lang,
  isRental = false,
}: {
  data?: AreaReportType;
  lang: LangType;
  isRental?: boolean;
}) => {
  const translate = new Translator("dashboard");
  if (data) {
    return (
      <ul className=" border-solid border-[1px] border-slate-200 rounded-md">
        <li>
          <div className="flex w-full p-3">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "areaCenter")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">{data.address}</p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex w-full p-3 bg-slate-100">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, isRental ? "averagePriceRental" : "averagePrice")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.averagePrice)}
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex w-full p-3">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, isRental ? "highestPriceRental" : "highestPrice")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.highestPrice)}
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex w-full bg-slate-100 p-3">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, isRental ? "lowestPriceRental" : "lowestPrice")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.lowestPrice)}
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex w-full p-3">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, isRental ? "averageM2PriceRental" : "averageM2Price")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.averageM2Price)}
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex w-full bg-slate-100 p-3">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, isRental ? "highestM2PriceRental" : "highestM2Price")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.highestM2Price)}
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex w-full p-3">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, isRental ? "lowestM2PriceRental" : "lowestM2Price")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.lowestM2Price)}
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex w-full bg-slate-100 p-3">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "averageSize")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">{`${roundNumberToDecimal(
                data.averageSize,
                0
              )} m2`}</p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex w-full p-3">
            <div className="w-[50%]">
              <p className="text-sm">
                {translate.getTranslation(lang, isRental ? "rentalCount" : "salesCount")}
              </p>
            </div>
            <div className="w-[50%]">
              <p className="font-bold text-sm">{data.count}</p>
            </div>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <div>
      <div className="flex flex-column w-full justify-center h-[200px]">
        <p className="flex items-center text-slate-400 text-center font-sm">
          {translate.getTranslation(lang, isRental ? "areaEmptyDataRental" : "areaEmptyData")}
        </p>
      </div>
    </div>
  );
};

export default AreaReport;
