import { LangType } from "../../types/dashboard.types";
import { Translator } from "../../data/language/translator";
import { Link } from "@remix-run/react";

const PropertyCard = ({
  name,
  photo,
  bondsNumber,
  investment,
  interest,
  maturity,
  lang,
  link,
}: {
  name: string;
  photo: string;
  bondsNumber: number;
  investment: number;
  interest: number;
  maturity: number;
  lang: LangType;
  link: string;
}) => {
  const translator = new Translator("components");
  return (
    <div>
      <div className="relative">
        <div className="w-full h-[200px] overflow-hidden rounded-xl mb-3">
          <Link to={link}>
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
        <span className="absolute text-center font-semibold top-[10px] right-[6px] bg-blue-400 text-white text-[12px] rounded-lg py-1 px-2 w-fit">
          {name}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 px-2">
        <div className="flex flex-row justify-between px-1">
          <p className="flex text-[16px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-teal-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
              />
            </svg>
            <span className="ml-2">{translator.getTranslation(lang, 'propCardBonds')}</span>
          </p>
          <p className="font-bold text-[16px]">{bondsNumber}</p>
        </div>
        <div className="flex flex-row justify-between px-1">
          <p className="flex text-[16px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-blue-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="ml-2">{translator.getTranslation(lang, 'propCardValue')}</span>
          </p>
          <p className="font-bold text-[16px]">{`${investment}€`}</p>
        </div>
        <div className="flex flex-row justify-between px-1">
          <p className="flex text-[16px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-violet-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>

            <span className="ml-2">{translator.getTranslation(lang, 'propCardInterest')}</span>
          </p>
          <p className="font-bold text-[16px]">{`${interest}€`}</p>
        </div>
        <div className="flex flex-row justify-between px-1">
          <p className="flex text-[16px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-red-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
              />
            </svg>

            <span className="ml-2">{translator.getTranslation(lang, 'propCardMature')}</span>
          </p>
          <p className="font-bold text-[16px]">{maturity}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
