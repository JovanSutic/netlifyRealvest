import { Translator } from "../../data/language/translator";
import { LangType } from "../../types/dashboard.types";

const PriceIndex = ({ index, lang }: { index: number; lang: LangType }) => {
  const colorMap: Record<string, string> = {
    1: "bg-red-500",
    2: "bg-red-300",
    3: "bg-yellow-500",
    4: "bg-green-300",
    5: "bg-green-500",
  };
  const translate = new Translator('components');
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 gap-1">
        {[1, 2, 3, 4, 5].map((item) => {
          if (item > index) {
            return <div key={item} className="text-sm h-5 bg-gray-200 rounded-sm"></div>;
          } else {
            return (
              <div
                key={item}
                className={`${
                  colorMap[index as unknown as string]
                } text-sm rounded-sm h-5`}
              ></div>
            );
          }
        })}
      </div>
      <p className="text-center mt-2 font-semibold text-md">{translate.getTranslation(lang, `priceIndex${index}`)}</p>
      <p className="text-center font-regular text-sm text-gray-500">{translate.getTranslation(lang, `priceIndexAdvice${index}`)}</p>
    </div>
  );
};

export default PriceIndex;
