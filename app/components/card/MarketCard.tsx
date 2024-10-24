import { Link } from "@remix-run/react";
import { Translator } from "../../data/language/translator";
import { LangType } from "../../types/dashboard.types";
import { getNumberWithDecimals } from "../../utils/market";
import { getNumbersFromString } from "../../utils/text";
import ImageLoader from "../image";

const MarketCard = ({
  photo,
  title,
  duration,
  link,
  appreciation,
  lang,
  price,
  rent,
  rentPrice,
  irr,
}: {
  photo: string;
  title: string;
  duration: string;
  link: string;
  appreciation: number;
  lang: LangType;
  price: string;
  rent: boolean;
  rentPrice?: string;
  irr?: string;
}) => {
  const translate = new Translator("market");
  const irrNumber = irr ? getNumbersFromString(irr!) : undefined;

  const rentPriceNumber = rentPrice
    ? getNumbersFromString(rentPrice!)
    : undefined;

  return (
    <Link
      to={link}
      className="bg-white rounded-xl cursor-pointer hover:-translate-y-1 transition-all shadow-md relative"
    >
      <div className="w-full h-[220px] lg:h-[180px] overflow-hidden relative rounded-t-xl mb-2">
        <ImageLoader src={photo} type="gallery" />
      </div>

      <div className="px-3 py-1 absolute right-2 top-2 text-[15px] shadow-md font-bold bg-blue-700 text-white bg-opacity-70 rounded-xl">
        {price}
      </div>

      <div className="pb-7 mb-3">
        <div className="px-2">
          <h3 className="text-lg lg:text-[16px] font-bold text-black mb-2">
            {title}
          </h3>
        </div>
        <div className="flex flex-col px-2 overflow-hidden">
          <div className="flex flex-row gap-2 mb-2">
            <p className="w-[80%] text-gray-600 mr-1 text-md md:text-[13px]">
              {translate.getTranslation(lang, "cardAppreciation")}
            </p>
            <p
              className={`w-[20%] text-blue-500 text-lg lg:text-sm content-center text-right font-extrabold mr-1 ${
                appreciation > 0 ? "text-blue-500" : "text-red-500"
              }`}
            >{`${getNumberWithDecimals((appreciation || 0) * 100, 2)}%`}</p>
          </div>
          {irr && (
            <div className="flex flex-row gap-2 mb-2">
              <p className="w-[80%] text-gray-600 mr-1 text-md md:text-[13px]">
                {translate.getTranslation(lang, "cardIrr")}
              </p>
              <p
                className={`w-[20%] font-extrabold mr-1 text-lg lg:text-sm text-right content-center ${
                  (irrNumber || 0) < 0 ? "text-red-500" : "text-blue-500"
                }`}
              >
                {irr}
              </p>
            </div>
          )}
          {rentPrice && (
            <div className="flex flex-row gap-2 mb-1">
              <p className="w-[80%] text-gray-600 mr-1 text-md md:text-[13px]">
                {translate.getTranslation(lang, "cardRental")}
              </p>
              <p
                className={`w-[20%] font-extrabold mr-1 text-lg lg:text-sm text-right content-center  ${
                  (rentPriceNumber || 0) > 0
                    ? "text-blue-500 font-bold"
                    : "text-gray-400 font-light center text-sm"
                }`}
              >
                {(rentPriceNumber || 0) > 0
                  ? rentPrice
                  : translate.getTranslation(lang, "noData")}
              </p>
            </div>
          )}
          {!irr && !rentPrice && (
            <p className="mt-1">
              <span className="text-gray-700 mr-1 text-md md:text-sm">
                {`${translate.getTranslation(lang, "rentalHighlight")}:`}
              </span>
              <span
                className={`font-regular mr-1 text-md md:text-sm ${
                  rent ? "text-blue-500" : "text-gray-400"
                }`}
              >
                {`${translate.getTranslation(
                  lang,
                  rent ? "rentOn" : "rentOff"
                )}`}
              </span>
            </p>
          )}

          <p className=" absolute bottom-3 left-3 text-gray-400 text-[13px] font-regular md:font-thin">
            {duration}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;
