import { FeatureReportData, LangType } from "../types/dashboard.types";
import { Translator } from "../data/language/translator";

const FeatureReport = ({
  data,
  lang,
  isRental = false,
  mobile,
}: {
  data?: FeatureReportData;
  lang: LangType;
  isRental: boolean;
  mobile: boolean;
}) => {
  const translate = new Translator("dashboard");
  const padding: string = mobile ? "px-2 py-1" : "px-2 py-2";
  if (data?.essentials.length || data?.benefits.length) {
    return (
      <>
        <p className="text-sm mb-3">
          {data.essentials.length > 0 &&
            translate.getTranslation(lang, "featureEssentials")}
        </p>
        <ul className="border-solid border-[1px] border-slate-200 rounded-md mb-6">
          {data.essentials.length > 0 && (
            <>
              {data.essentials.map((item, index) => (
                <li key={Object.keys(item)[0]}>
                  <div
                    className={
                      index % 2 !== 0
                        ? `flex w-full bg-slate-100 px-2 py-1 ${padding}`
                        : `flex w-full px-2 py-1 ${padding}`
                    }
                  >
                    <div className="w-[70%]">
                      <p className="text-sm">
                        {translate.getTranslation(lang, Object.keys(item)[0])}
                      </p>
                    </div>
                    <div className="w-[30%]">
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
        <p className="text-sm mb-3">
          {data.benefits.length > 0 &&
            translate.getTranslation(lang, "featureBenefits")}
        </p>
        <ul className="border-solid border-[1px] border-slate-200 rounded-md">
          {data.benefits.length > 0 && (
            <>
              {data.benefits.map((item, index) => (
                <li key={Object.keys(item)[0]}>
                  <div
                    className={
                      index % 2 !== 0
                        ? `flex w-full bg-slate-100 px-2 py-1 ${padding}`
                        : `flex w-full px-2 py-1 ${padding}`
                    }
                  >
                    <div className="w-[70%]">
                      <p className="text-sm">
                        {translate.getTranslation(lang, Object.keys(item)[0])}
                      </p>
                    </div>
                    <div className="w-[30%]">
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
      </>
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
