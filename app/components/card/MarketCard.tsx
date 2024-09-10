import { Link } from "@remix-run/react";
import { Translator } from "../../data/language/translator";
import { LangType } from "../../types/dashboard.types";

const MarketCard = ({
  photo,
  title,
  duration,
  link,
  demand,
  appreciation,
  lang,
  price,
  rent,
}: {
  photo: string;
  title: string;
  duration: string;
  link: string;
  demand: string;
  appreciation: string;
  lang: LangType;
  price: string;
  rent: boolean;
}) => {
  const translate = new Translator("market");

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
        <h3 className="text-lg lg:text-sm font-semibold text-black mb-2">{title}</h3>
        <p>
          <span className="text-gray-700 font-bold mr-1 text-md md:text-sm">
            {`${translate.getTranslation(lang, "trendShort")}:`}
          </span>
          <span className="text-blue-500 text-md font-extrabold mr-1">
            {appreciation}
          </span>
          <span className="text-gray-600 text-[12px]">{`(${translate.getTranslation(
            lang,
            "trendLong"
          )})`}</span>
        </p>
        <p>
          <span className="text-gray-700 font-bold mr-1 text-md md:text-sm">
            {`${translate.getTranslation(lang, "demandShort")}:`}
          </span>
          <span className="text-blue-500 text-md font-extrabold mr-1">
            {demand}
          </span>
          <span className="text-gray-600 text-[12px]">{`(${translate.getTranslation(
            lang,
            "demandLong"
          )})`}</span>
        </p>
        <p className="mt-1">
          <span className="text-gray-700 mr-1 text-md md:text-sm">
            {`${translate.getTranslation(lang, "rentalHighlight")}:`}
          </span>
          <span className={`font-regular mr-1 text-md md:text-sm ${rent ? 'text-blue-500' : 'text-gray-400'}`}>
            {`${translate.getTranslation(lang, rent ? "rentOn" : "rentOff")}`}
          </span>
        </p>

        <p className=" absolute bottom-3 left-3 text-gray-400 text-[13px] font-regular md:font-thin">
          {duration}
        </p>
      </div>
    </Link>
  );
};

export default MarketCard;
