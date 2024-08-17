import { makeNumberCurrency, roundNumberToDecimal } from "../utils/numbers";
import {
  AreaReportType,
  LangType,
} from "../types/dashboard.types";
import { Translator } from "../data/language/translator";

const AreaReport = ({
  data,
  lang,
  isRental = false,
  mobile,
}: {
  data?: AreaReportType;
  lang: LangType;
  isRental?: boolean;
  mobile: boolean;
}) => {
  const translate = new Translator("dashboard");
  const padding: string = mobile ? "px-2 py-1" : "px-2 py-2";

  if (data) {
    return (
      <div>
        <div className="w-full mb-3">
          <p className="font-semibold text-[16px] text-center">{`${translate.getTranslation(
            lang,
            "areaCenter"
          )} ${data.address}`}</p>
        </div>

        <ul className=" border-solid border-[1px] border-slate-200 rounded-md">
          <li>
            <div className={`flex w-full ${padding} bg-slate-100`}>
              <div className="w-[75%]">
                <p className="text-sm">
                  {translate.getTranslation(
                    lang,
                    isRental ? "averagePriceRental" : "averagePrice"
                  )}
                </p>
              </div>
              <div className="w-[25%]">
                <p className="font-semibold text-right text-sm">
                  {makeNumberCurrency(data.averagePrice)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className={`flex w-full ${padding}`}>
              <div className="w-[75%]">
                <p className="text-sm">
                  {translate.getTranslation(
                    lang,
                    isRental ? "highestPriceRental" : "highestPrice"
                  )}
                </p>
              </div>
              <div className="w-[25%]">
                <p className="font-semibold text-right text-sm">
                  {makeNumberCurrency(data.highestPrice)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className={`flex w-full ${padding} bg-slate-100`}>
              <div className="w-[75%]">
                <p className="text-sm">
                  {translate.getTranslation(
                    lang,
                    isRental ? "lowestPriceRental" : "lowestPrice"
                  )}
                </p>
              </div>
              <div className="w-[25%]">
                <p className="font-semibold text-right text-sm">
                  {makeNumberCurrency(data.lowestPrice)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className={`flex w-full ${padding}`}>
              <div className="w-[75%]">
                <p className="text-sm">
                  {translate.getTranslation(
                    lang,
                    isRental ? "averageM2PriceRental" : "averageM2Price"
                  )}
                </p>
              </div>
              <div className="w-[25%]">
                <p className="font-semibold text-right text-sm">
                  {makeNumberCurrency(data.averageM2Price)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className={`flex w-full ${padding} bg-slate-100`}>
              <div className="w-[75%]">
                <p className="text-sm">
                  {translate.getTranslation(
                    lang,
                    isRental ? "highestM2PriceRental" : "highestM2Price"
                  )}
                </p>
              </div>
              <div className="w-[25%]">
                <p className="font-semibold text-right text-sm">
                  {makeNumberCurrency(data.highestM2Price)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className={`flex w-full ${padding}`}>
              <div className="w-[75%]">
                <p className="text-sm">
                  {translate.getTranslation(
                    lang,
                    isRental ? "lowestM2PriceRental" : "lowestM2Price"
                  )}
                </p>
              </div>
              <div className="w-[25%]">
                <p className="font-semibold text-right text-sm">
                  {makeNumberCurrency(data.lowestM2Price)}
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className={`flex w-full ${padding} bg-slate-100`}>
              <div className="w-[75%]">
                <p className="text-sm">
                  {translate.getTranslation(lang, "averageSize")}
                </p>
              </div>
              <div className="w-[25%]">
                <p className="font-semibold text-right text-sm">{`${roundNumberToDecimal(
                  data.averageSize,
                  0
                )} m2`}</p>
              </div>
            </div>
          </li>
          <li>
            <div className={`flex w-full ${padding}`}>
              <div className="w-[75%]">
                <p className="text-sm">
                  {translate.getTranslation(
                    lang,
                    isRental ? "rentalCount" : "salesCount"
                  )}
                </p>
              </div>
              <div className="w-[25%]">
                <p className="font-semibold text-right text-sm">{data.count}</p>
              </div>
            </div>
          </li>
        </ul>
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
