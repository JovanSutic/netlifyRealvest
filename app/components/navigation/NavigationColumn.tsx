import { Link } from "@remix-run/react";
import { LangType } from "../../types/dashboard.types";
import Dropdown from "../select/Dropdown";
import { Translator } from "../../data/language/translator";
import { User } from "@supabase/supabase-js";

const NavigationColumn = ({
  isOpen,
  toggleOpen,
  lang,
  user = null,
  url,
}: {
  isOpen: boolean;
  toggleOpen: () => void;
  lang: LangType;
  url: string;
  user?: User | null;
}) => {
  const translate = new Translator("navigation");
  const isBlog = url.split("/")?.[1] === "blog";

  return (
    <header className={`sticky top-[-1px] lg:top-0 bg-white z-[9999] shadow`}>
      <div className="w-full xl:w-[1260px] mx-auto pb-0 lg:pb-1">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-center px-4 py-4 lg:py-2">
            <div className="w-[110px]">
              <a href={`/?lang=${lang}`}>
                <img
                  src="/logo1.png"
                  alt="Realvest logo"
                  className="max-w-full"
                  width="160"
                  height="46"
                />
              </a>
            </div>
          </div>
          <div className="hidden lg:block flex flex-row-reverse">
            <div className="px-4 py-2">
              <ul className="flex flex-row">
                {user && (
                  <li className="mr-6">
                    <Link
                      to={`/portfolio/?lang=${lang}`}
                      className="text-[16px] font-semibold text-gray-700 hover:text-blue-600 leading-[40px]"
                    >
                      {translate.getTranslation(lang, "portfolio")}
                    </Link>
                  </li>
                )}
                <li className="mr-6">
                  {" "}
                  <Link
                    to={`/offer/?lang=${lang}`}
                    className="text-[16px] font-semibold text-gray-700 hover:text-blue-600 leading-[40px]"
                  >
                    {translate.getTranslation(lang, "invest")}
                  </Link>{" "}
                </li>
                {!user && (
                  <li className="mr-6">
                    {" "}
                    <Link
                      to={`/knowledge/?lang=${lang}`}
                      className="text-[16px] font-semibold text-gray-700 hover:text-blue-600 leading-[40px]"
                    >
                      {translate.getTranslation(lang, "knowledge")}
                    </Link>{" "}
                  </li>
                )}

                {!user && (
                  <li className="mr-6">
                    <Link
                      to={`/auth/?lang=${lang}`}
                      className="hidden md:block text-[16px] font-semibold px-4 py-2 bg-gray-200 text-gray-800 rounded-xl transition-all duration-300 transform hover:bg-gray-300 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                    >
                      {translate.getTranslation(lang, "loginNav")}
                    </Link>
                  </li>
                )}
                {user && (
                  <li className="mr-6">
                    <Link
                      to={`/auth/sign_out?lang=${lang}`}
                      className="hidden md:block text-[15px] font-semibold px-4 py-2 bg-gray-200 text-gray-800 rounded-xl transition-all duration-300 transform hover:bg-gray-300 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                    >
                      {translate.getTranslation(lang, "logoutNav")}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="hidden lg:block lg:flex lg:flex-row-reverse">
            <div className="p-2">
              <ul className="flex flex-row">
                {!user && (
                  <li className="mr-8">
                    <Link
                      to={`/auth/register?lang=${lang}`}
                      className="hidden md:block text-[16px] font-semibold px-6 py-2 bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:bg-blue-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                    >
                      {translate.getTranslation(lang, "account")}
                    </Link>
                  </li>
                )}

                {!isBlog && (
                  <li className="pt-[1px]">
                    <Dropdown activeText={lang === "sr" ? "Srpski" : "English"}>
                      <ul>
                        {lang === "sr" ? (
                          <li className="px-4 py-2">
                            <Link
                              to={"?lang=en"}
                              className="text-gray-700 hover:text-blue-600"
                            >
                              English
                            </Link>
                          </li>
                        ) : (
                          <li className="px-4 py-2">
                            <Link
                              to={"?lang=sr"}
                              className="text-gray-700 hover:text-blue-600"
                            >
                              Srpski
                            </Link>
                          </li>
                        )}
                      </ul>
                    </Dropdown>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="block lg:hidden flex flex-row-reverse px-4 py-4">
            <button id="toggleOpen" onClick={toggleOpen}>
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-bold"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8"
                  fill="bg-black"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {true && (
        <div
          id="collapseMenu"
          className={`top-[64px] right-0 w-[100vw] bg-slate-800 bg-opacity-40 p-10 pl-20 text-white fixed h-full z-[9999] ease-in-out duration-300 ${
            isOpen ? "translate-x-0 " : "translate-x-full"
          }`}
        >
          {/* <button
            id="toggleClose"
            onClick={toggleOpen}
            className="fixed top-2 right-4 z-[9999] rounded-full bg-gray-200 p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button> */}

          <ul className="block fixed bg-blue-100 w-1/2 min-w-[100%] top-0 left-0 h-full shadow-md overflow-auto z-[9998]">
            {user && (
              <li className="pt-6 px-3">
                <Link to={`/offer/?lang=${lang}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 w-6 mr-3 inline text-blue-900 font-bold"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                  <span className="text-gray-700 text-[15px] font-bold">
                    {translate.getTranslation(lang, "portfolio")}
                  </span>
                </Link>
              </li>
            )}
            <li className="pt-6 px-3">
              <Link to={`/offer/?lang=${lang}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 w-6 mr-3 inline text-blue-900 font-bold"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-[15px] font-bold">
                  {translate.getTranslation(lang, "invest")}
                </span>
              </Link>
            </li>
            <li className="pt-8 px-3">
              <Link to={`/knowledge/?lang=${lang}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 w-6 mr-3 inline text-blue-900 font-bold"
                >
                  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>
                <span className="text-gray-700 text-[15px] font-bold">
                  {translate.getTranslation(lang, "knowledge")}
                </span>
              </Link>
            </li>
            {!user && (
              <>
                <li className="pt-8 px-3">
                  <Link to={`/auth/?lang=${lang}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 w-6 mr-3 inline text-blue-900 font-bold"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 text-[15px] font-bold">
                      {translate.getTranslation(lang, "loginNav")}
                    </span>
                  </Link>
                </li>
                <li className="pt-8 px-3">
                  <Link
                    to={`/auth/register?lang=${lang}`}
                    className="text-[16px] font-semibold px-6 py-2 bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:bg-blue-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                  >
                    {translate.getTranslation(lang, "account")}
                  </Link>
                </li>
              </>
            )}
            {user && (
              <li className="pt-6 px-3 mt-6">
                <Link
                  to={`/auth/sign_out?lang=${lang}`}
                  className="text-white text-sm flex items-center rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="size-6 w-6 mr-3 inline text-blue-900 font-bold"
                    viewBox="0 0 6.35 6.35"
                  >
                    <path
                      d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                      data-original="#000000"
                    />
                  </svg>
                  <span className="text-gray-700 text-[15px] font-bold">
                    {translate.getTranslation(lang, "logoutNav")}
                  </span>
                </Link>
              </li>
            )}

            {!isBlog && (
              <li className="pt-8 px-3">
                <Dropdown activeText={lang === "sr" ? "Srpski" : "English"}>
                  <ul>
                    {lang === "sr" ? (
                      <li className="px-4 py-2">
                        <Link
                          to={"?lang=en"}
                          className="text-blue-600 text-[14px] font-bold"
                        >
                          English
                        </Link>
                      </li>
                    ) : (
                      <li className="px-4 py-2">
                        <Link
                          to={"?lang=sr"}
                          className="text-blue-600 text-[14px] font-bold"
                        >
                          Srpski
                        </Link>
                      </li>
                    )}
                  </ul>
                </Dropdown>
              </li>
            )}
          </ul>
        </div>
      )}{" "}
    </header>
  );
};

export default NavigationColumn;
