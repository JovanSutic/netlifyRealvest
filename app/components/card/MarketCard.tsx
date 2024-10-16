import { Link } from "@remix-run/react";
import { Translator } from "../../data/language/translator";
import { LangType } from "../../types/dashboard.types";
import { getNumberWithDecimals } from "../../utils/market";
import { getNumbersFromString } from "../../utils/text";

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
      className="bg-white rounded-xl cursor-pointer hover:-translate-y-1 transition-all relative shadow-lg"
    >
      <div className="px-3 py-1 absolute right-2 top-2 text-[15px] shadow-md font-bold bg-blue-700 text-white bg-opacity-70 rounded-xl">
        {price}
      </div>

      <div className="w-full h-[180px] overflow-hidden rounded-t-xl mb-4">
        <img
          src={photo || "empty.jpg"}
          alt="Product 1"
          className="h-full w-full object-center"
        />
      </div>

      <div className="px-3 mb-12">
        <h3 className="text-lg lg:text-[15px] font-bold text-black mb-2">
          {title}
        </h3>
        <p>
          <span className="text-gray-600 mr-1 text-md md:text-sm">
            {`${translate.getTranslation(lang, "trendShort")}:`}
          </span>
          <span
            className={`text-blue-500 text-md font-extrabold mr-1 ${
              appreciation > 0 ? "text-blue-500" : "text-red-500"
            }`}
          >
            {`${getNumberWithDecimals((appreciation || 0) * 100, 2)}%`}
          </span>
          <span className="text-gray-600 text-[12px]">{`(${translate.getTranslation(
            lang,
            "trendLong"
          )})`}</span>
        </p>
        {irr && (
          <p className="mt-1">
            <span className="text-gray-600 mr-1 text-md md:text-sm">
              {`${translate.getTranslation(lang, "cardIrr")}:`}
            </span>
            <span
              className={`font-bold mr-1 text-md md:text-sm ${
                (irrNumber || 0) < 0 ? "text-red-500" : "text-blue-500"
              }`}
            >
              {irr}
            </span>
          </p>
        )}
        {rentPrice && (
          <p className="mt-1">
            <span className="text-gray-600 mr-1 text-md md:text-sm">
              {`${translate.getTranslation(lang, "cardRentPrice")}:`}
            </span>
            <span
              className={`mr-1 text-md md:text-sm ${
                (rentPriceNumber || 0) > 0 ? "text-blue-500 font-bold" : "text-gray-400 font-regular"
              }`}
            >
              {(rentPriceNumber || 0) > 0
                ? rentPrice
                : translate.getTranslation(lang, "noData")}
            </span>
          </p>
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
              {`${translate.getTranslation(lang, rent ? "rentOn" : "rentOff")}`}
            </span>
          </p>
        )}

        <p className=" absolute bottom-3 left-3 text-gray-400 text-[13px] font-regular md:font-thin">
          {duration}
        </p>
      </div>
    </Link>
  );
};

export default MarketCard;
