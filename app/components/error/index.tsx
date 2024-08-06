import { Link } from "@remix-run/react";
import { LangType } from "../../types/dashboard.types";
import { Translator } from "../../data/language/translator";

export const ErrorPage = ({
  lang = "sr",
  link,
}: {
  lang?: LangType;
  link: string;
}) => {
  const translator = new Translator("homepage");

  return (
    <div className="flex flex-col w-full">
      <div className="w-full relative mb-10">
        <div className="w-[140px] mx-auto">
          <img src="/logo2.png" alt="Realvest logo" className="max-w-full" />
        </div>
      </div>
      <div className="flex flex-row justify-center pt-4">
        <p className="text-4xl font-bold">
          {translator.getTranslation(lang, "errorPageTitle")}
        </p>
      </div>
      <div className="w-full md:w-[500px] mx-auto flex flex-row justify-center mt-6 mb-6">
        <p className="text-center text-[20px]">
          {translator.getTranslation(lang, "errorPageSubTitle")}
        </p>
      </div>
      <div className="flex flex-row justify-center pt-5">
        <button className="inline-flex mb-1 items-center px-5 py-3 text-md font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:outline-none">
          <Link to={link} reloadDocument className="inline-flex items-center">
            {translator.getTranslation(lang, "errorPageButton")}
          </Link>
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
