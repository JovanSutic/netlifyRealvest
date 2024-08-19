import { Translator } from "../../data/language/translator";
import { FiltersType, LangType } from "../../types/dashboard.types";

const FiltersDisplay = ({
  mobile,
  lang,
  filters,
  openFilters,
}: {
  mobile: boolean;
  lang: LangType;
  filters: FiltersType;
  openFilters: () => void;
}) => {
  const translate = new Translator("dashboard");
  const reportTranslate = new Translator("report");

  return (
    <div className="grid grid-cols-4 gap-2 mt-6">
      {mobile ? (
        <>
          <div className="col-span-2">
            <div className="flex flex-col items-center">
              <p className="text-[11px] md:text-xs font-regular text-gray-500">
                {translate.getTranslation(lang, "timeRange").toUpperCase()}
              </p>
              <p className="font-bold text-[14px] md:text-sm">
                {translate.getTranslation(lang, filters.timeRange)}
              </p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex flex-col items-center">
              <p className="text-[11px] md:text-xs font-regular text-gray-500">
                {translate.getTranslation(lang, "areaRange").toUpperCase()}
              </p>
              <p className="font-bold text-[14px] md:text-sm">{`${
                filters.range
              } ${translate.getTranslation(lang, "meters")}`}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex flex-col items-center">
              <p className="text-[11px] md:text-xs font-regular text-gray-500">
                {translate.getTranslation(lang, "propertyType").toUpperCase()}
              </p>
              <p className="font-bold text-[14px] md:text-sms">
                {reportTranslate.getTranslation(
                  lang!,
                  `${filters.propertyType}Type`
                )}
              </p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex flex-row justify-center items-center w-full">
              {" "}
              <button
                onClick={openFilters}
                className="bg-blue-500 text-white flex flex-row gap-2 justify-center font-semibold leading-[28px] rounded-md px-3 py-1 hover:bg-blue-600"
              >
                {translate.getTranslation(lang, "filters")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8 text-center"
                >
                  <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="col-span-4 xl:col-span-3">
            <div className="flex flex-row justify-around">
              <div className="flex flex-col items-center">
                <p className="text-[11px] md:text-xs font-regular text-gray-500">
                  {translate.getTranslation(lang, "timeRange").toUpperCase()}
                </p>
                <p className="font-bold text-[14px] md:text-sm">
                  {translate.getTranslation(lang, filters.timeRange)}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[11px] md:text-xs font-regular text-gray-500">
                  {translate.getTranslation(lang, "areaRange").toUpperCase()}
                </p>
                <p className="font-bold text-[14px] md:text-sm">{`${
                  filters.range
                } ${translate.getTranslation(lang, "meters")}`}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[11px] md:text-xs font-regular text-gray-500">
                  {translate.getTranslation(lang, "propertyType").toUpperCase()}
                </p>
                <p className="font-bold text-[14px] md:text-sms">
                  {reportTranslate.getTranslation(
                    lang!,
                    `${filters.propertyType}Type`
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-4 xl:col-span-1">
            <div className="flex flex-row justify-center items-center w-full">
              {" "}
              <button
                onClick={openFilters}
                className="bg-blue-500 text-white flex flex-row gap-2 justify-center font-semibold leading-[28px] rounded-md px-3 py-1 hover:bg-blue-600"
              >
                {translate.getTranslation(lang, "filters")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-8 text-center"
                >
                  <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FiltersDisplay;
