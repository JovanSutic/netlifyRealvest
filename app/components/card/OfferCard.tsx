import { LangType } from "../../types/dashboard.types";
import { Translator } from "../../data/language/translator";
import { Link } from "@remix-run/react";

const OfferCard = ({
  name,
  photo,
  isPremium,
  interest,
  maturity,
  lang,
  link,
}: {
  name: string;
  photo: string;
  isPremium: boolean;
  interest: number;
  maturity: number;
  lang: LangType;
  link: string;
}) => {
  const translator = new Translator("components");
  return (
    <div>
      <div className="w-full h-[180px] overflow-hidden rounded-xl mb-2">
        <Link to={link}>
          <img src={photo} alt={name} className="w-full h-full object-cover" />
        </Link>
      </div>

      <Link to={link}>
        <p className="font-semibold text-[19px] lg:text-[17px] mb-1">{name}</p>
      </Link>
      <div className="grid grid-cols-2">
        <div className="flex flex-col items-left">
          <p className="font-light text-gray-600 text-[15px]">
            {translator.getTranslation(lang, "offerInterest")}
          </p>
          <p className="font-bold text-blue-600 text-[26px]">{`${interest}%`}</p>
        </div>
        <div className="flex flex-col gap-2">
          {isPremium && (
            <div className="flex flex-row justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-green-500"
              >
                <path
                  fillRule="evenodd"
                  d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-light text-gray-600 text-[15px] ml-2">
                {translator.getTranslation(lang, "offerPremium")}
              </span>
            </div>
          )}

          <div className="flex flex-row justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <span className="font-light text-gray-600 text-[15px] ml-2">
              {`${maturity} ${translator.getTranslation(
                lang,
                "offerMaturity"
              )}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
