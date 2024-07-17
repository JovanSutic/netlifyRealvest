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
      <ul className=" border-solid border-[1px] border-slate-300">
        <li className="py-1">
          <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "areaCenter")}
              </p>
            </div>
            <div className="w-[60%]">
              <p className="font-bold text-sm">{data.address}</p>
            </div>
          </div>
        </li>
        <li className="py-1">
          <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "averagePrice")}
              </p>
            </div>
            <div className="w-[60%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.averagePrice)}
              </p>
            </div>
          </div>
        </li>
        <li className="py-1">
          <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "highestPrice")}
              </p>
            </div>
            <div className="w-[60%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.highestPrice)}
              </p>
            </div>
          </div>
        </li>
        <li className="py-1">
          <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "lowestPrice")}
              </p>
            </div>
            <div className="w-[60%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.lowestPrice)}
              </p>
            </div>
          </div>
        </li>
        <li className="py-1">
          <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "averageM2Price")}
              </p>
            </div>
            <div className="w-[60%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.averageM2Price)}
              </p>
            </div>
          </div>
        </li>
        <li className="py-1">
          <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "highestM2Price")}
              </p>
            </div>
            <div className="w-[60%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.highestM2Price)}
              </p>
            </div>
          </div>
        </li>
        <li className="py-1">
          <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "lowestM2Price")}
              </p>
            </div>
            <div className="w-[60%]">
              <p className="font-bold text-sm">
                {makeNumberCurrency(data.lowestM2Price)}
              </p>
            </div>
          </div>
        </li>
        <li className="py-1">
          <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, "averageSize")}
              </p>
            </div>
            <div className="w-[60%]">
              <p className="font-bold text-sm">{`${roundNumberToDecimal(
                data.averageSize,
                0
              )} m2`}</p>
            </div>
          </div>
        </li>
        <li className="py-1">
          <div className="flex w-full p-2">
            <div className="w-[40%]">
              <p className="text-sm">
                {translate.getTranslation(lang, isRental ? "rentalCount" : "salesCount")}
              </p>
            </div>
            <div className="w-[60%]">
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
