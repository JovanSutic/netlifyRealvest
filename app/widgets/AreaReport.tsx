import { makeNumberCurrency, roundNumberToDecimal } from "../utils/numbers";
import { AreaReportType, LangType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";
import Tooltip from "../components/tooltip/Tooltip";

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
      <div className="w-full">
        <div className="w-full flex flex-row-reverse">
          <div className="w-[30px]">
            <Tooltip
              text={translate.getTranslation(lang, "infoReport")}
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="bg-blue-50 rounded-md py-2 px-1">
            <div className={`flex flex-col w-full justify-center`}>
              <div className="w-full">
                <p className="text-xs text-center text-gray-500">
                  {translate.getTranslation(
                    lang,
                    isRental ? "averageM2PriceRental" : "averageM2Price"
                  )}
                </p>
              </div>
              <div className="w-full mt-1">
                <p className="font-bold text-center text-sm">
                  {makeNumberCurrency(data.averageM2Price)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-md py-2 px-1">
            <div className={`flex flex-col w-full justify-center`}>
              <div className="w-full">
                <p className="text-xs text-center text-gray-500">
                  {translate.getTranslation(
                    lang,
                    isRental ? "lowestM2PriceRental" : "lowestM2Price"
                  )}
                </p>
              </div>
              <div className="w-full mt-1">
                <p className="font-bold text-center text-md">
                  {makeNumberCurrency(data.lowestM2Price)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-md py-2 px-1">
            <div className={`flex flex-col w-full justify-center`}>
              <div className="w-full">
                <p className="text-xs text-center text-gray-500">
                  {translate.getTranslation(
                    lang,
                    isRental ? "highestM2PriceRental" : "highestM2Price"
                  )}
                </p>
              </div>
              <div className="w-full mt-1">
                <p className="font-bold text-center text-sm">
                  {makeNumberCurrency(data.highestM2Price)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-md py-2 px-1">
            <div className={`flex flex-col w-full justify-center`}>
              <div className="w-full">
                <p className="text-xs text-center text-gray-500">
                  {translate.getTranslation(
                    lang,
                    isRental ? "averagePriceRental" : "averagePrice"
                  )}
                </p>
              </div>
              <div className="w-full mt-1">
                <p className="font-bold text-center text-md">
                  {makeNumberCurrency(data.averagePrice)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-md py-2 px-1">
            <div className={`flex flex-col w-full justify-center rounded-md`}>
              <div className="w-full">
                <p className="text-xs text-center text-gray-500">
                  {translate.getTranslation(
                    lang,
                    isRental ? "lowestPriceRental" : "lowestPrice"
                  )}
                </p>
              </div>
              <div className="w-full mt-1">
                <p className="font-bold text-center text-md">
                  {makeNumberCurrency(data.lowestPrice)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-md py-2 px-1">
            <div className={`flex flex-col w-full justify-center`}>
              <div className="w-full">
                <p className="text-xs text-center text-gray-500">
                  {translate.getTranslation(
                    lang,
                    isRental ? "highestPriceRental" : "highestPrice"
                  )}
                </p>
              </div>
              <div className="w-full mt-1">
                <p className="font-bold text-center text-md">
                  {makeNumberCurrency(data.highestPrice)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-md py-2 px-1">
            <div className={`flex flex-col w-full justify-center`}>
              <div className="w-full">
                <p className="text-xs text-center text-gray-500">
                  {translate.getTranslation(lang, "averageSize")}
                </p>
              </div>
              <div className="w-full mt-1">
                <p className="font-bold text-center text-md">
                  {`${roundNumberToDecimal(data.averageSize, 0)} m2`}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-md py-2 px-1">
            <div className={`flex flex-col w-full justify-center`}>
              <div className="w-full">
                <p className="text-xs text-center text-gray-500">
                  {translate.getTranslation(
                    lang,
                    isRental ? "rental_count" : "salesCount"
                  )}
                </p>
              </div>
              <div className="w-full mt-1">
                <p className="font-bold text-center text-sm">{data.count}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-column w-full justify-center h-[200px]">
        <p className="flex items-center text-slate-400 text-center font-sm">
          {translate.getTranslation(
            lang,
            isRental ? "areaEmptyDataRental" : "areaEmptyData"
          )}
        </p>
      </div>
    </div>
  );
};

export default AreaReport;
