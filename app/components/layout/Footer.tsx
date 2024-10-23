import { Link } from "@remix-run/react";
import { TColumn, TLine, TPage } from ".";
import { LangType } from "../../types/dashboard.types";
import { Translator } from "../../data/language/translator";

const Footer = ({ mobile, lang }: { mobile: boolean; lang: LangType }) => {
  const translate = new Translator("homepage");
  return (
    <TPage color="bg-gray-700" mobile={mobile}>
      <TLine columns={1}>
        <TColumn span={1}>
          <footer className="bg-gray-700 p-10 font-[sans-serif] tracking-wide">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="lg:flex">
                <div className="max-w-[150px]">
                  <img src="/logo3.png" alt="logo" className="w-full" />
                </div>
              </div>

              <div className="lg:flex">
                <ul className="flex space-x-6">
                  <li>
                    <a
                      href="https://www.linkedin.com/company/yourealvest/?viewAsMember=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Linkedin Realvest"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-gray-300 hover:fill-white w-10 h-10"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zm-2.5 8.2v5.3h-2.79v-4.93a1.4 1.4 0 0 0-1.4-1.4c-.77 0-1.39.63-1.39 1.4v4.93h-2.79v-8.37h2.79v1.11c.48-.78 1.47-1.3 2.32-1.3 1.8 0 3.26 1.46 3.26 3.26zM6.88 8.56a1.686 1.686 0 0 0 0-3.37 1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 1.57v8.37H5.5v-8.37h2.77z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">
                  {translate.getTranslation(lang, "contact")}
                </h4>
                <ul className="text-gray-300 hover:text-white text-sm">
                  <li>office@yourealvest.com</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">
                  {translate.getTranslation(lang, "footerInfo")}
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to={`/market/?lang=${lang}&page=1`}
                      className="text-gray-300 hover:text-white text-sm"
                    >
                      {translate.getTranslation(lang, "market")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/blog?lang=${lang}`}
                      className="text-gray-300 hover:text-white text-sm"
                    >
                      {translate.getTranslation(lang, "blog")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/terms?lang=${lang}`}
                      className="text-gray-300 hover:text-white text-sm"
                    >
                      {translate.getTranslation(lang, "footerTerms")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/privacy?lang=${lang}`}
                      className="text-gray-300 hover:text-white text-sm"
                    >
                      {translate.getTranslation(lang, "footerPrivacy")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-gray-300 text-sm mt-10">
              © 2024 Realvest All Rights Reserved.
            </p>
          </footer>
        </TColumn>
      </TLine>
    </TPage>
  );
};

export default Footer;
