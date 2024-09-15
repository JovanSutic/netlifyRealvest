import { getMarketFeatures } from "../utils/market";
import { Translator } from "../data/language/translator";
import { Details, LangType } from "../types/dashboard.types";

const MarketFeatureList = ({
  details,
  lang,
}: {
  details: Details;
  lang: LangType;
}) => {
  const translate = new Translator("market");
  const features = getMarketFeatures(details);
  
  return (
    <div className="w-full">
      <div className={`w-full flex flex-column justify-between mb-4`}>
        <h3 className="text-lg text-center font-semibold">
          {translate.getTranslation(lang, "featTitle")}
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b-[1px] border-gray-400">
        <div className="flex">
          <p className="w-fit text-md font-semibold text-gray-600">
            {`${translate.getTranslation(lang, "featRooms")}: ${
              details.rooms || translate.getTranslation(lang, "noData")
            }`}
          </p>
        </div>
        <div className="flex">
          <p className="w-fit text-md font-semibold text-gray-600">
            {`${translate.getTranslation(lang, "featBaths")}: ${
              details.baths || translate.getTranslation(lang, "noData")
            }`}
          </p>
        </div>
        <div className="flex">
          <p className="w-fit text-md font-semibold text-gray-600">
            {`${translate.getTranslation(lang, "featFloor")}: ${
              details.floor || translate.getTranslation(lang, "noData")
            }`}
          </p>
        </div>
        <div className="flex mb-4">
          <p className="w-fit text-md font-semibold text-gray-600">
            {`${translate.getTranslation(lang, "featFloorLimit")}: ${
              details.floor_limit || translate.getTranslation(lang, "noData")
            }`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-4">
        {features.map((item) => (
          <div className="flex" key={item.name}>
            {item.isTrue ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-blue-500"
              >
                <path
                  fillRule="evenodd"
                  d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                  clipRule="evenodd"
                  className="stroke-2"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-red-500"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            <p className="w-fit ml-2">
              {translate.getTranslation(lang, item.name)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketFeatureList;