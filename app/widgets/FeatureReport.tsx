import { FeatureReportData, LangType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";

const FeatureReport = ({
  data,
  lang,
  isRental = false,
}: {
  data?: FeatureReportData;
  lang: LangType;
  isRental: boolean;
}) => {
  const translate = new Translator("dashboard");
  if (data) {
    return (
      <ul className="">
        {data.essentials.length > 0 && (
          <>
            <li className="py-1">
              <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
                <div className="w-[100%]">
                  <p className="text-md font-bold">
                    {translate.getTranslation(lang, "featureEssentials")}
                  </p>
                </div>
              </div>
            </li>
            {data.essentials.map((item) => (
              <li className="py-1" key={Object.keys(item)[0]}>
                <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
                  <div className="w-[40%]">
                    <p className="text-sm">
                      {translate.getTranslation(lang, Object.keys(item)[0])}
                    </p>
                  </div>
                  <div className="w-[60%]">
                    <p className="font-bold text-sm">{`${
                      item[Object.keys(item)[0]]
                    }%`}</p>
                  </div>
                </div>
              </li>
            ))}
          </>
        )}
        {data.benefits.length > 0 && (
          <>
            <li className="py-1">
              <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
                <div className="w-[100%]">
                  <p className="text-md font-bold">
                    {translate.getTranslation(lang, "featureBenefits")}
                  </p>
                </div>
              </div>
            </li>
            {data.benefits.map((item) => (
              <li className="py-1" key={Object.keys(item)[0]}>
                <div className="flex w-full border-solid border-b-[1px] border-slate-300 p-2">
                  <div className="w-[40%]">
                    <p className="text-sm">
                      {translate.getTranslation(lang, Object.keys(item)[0])}
                    </p>
                  </div>
                  <div className="w-[60%]">
                    <p className="font-bold text-sm">{`${
                      item[Object.keys(item)[0]]
                    }%`}</p>
                  </div>
                </div>
              </li>
            ))}
          </>
        )}
      </ul>
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

export default FeatureReport;
