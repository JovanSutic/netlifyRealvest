import { Link, useNavigate } from "@remix-run/react";
import { Translator } from "../../data/language/translator";
import { LangType } from "../../types/dashboard.types";
import { switchLanguage } from "../../utils/market";

const MobileNavigation = ({
  isOpen,
  toggleOpen,
  lang,
  url,
  name,
  signOutLink,
}: {
  isOpen: boolean;
  toggleOpen: () => void;
  lang: LangType;
  url: string;
  name: string;
  signOutLink: string;
}) => {
  const styleMap = {
    item: "text-gray-300 hover:text-white text-md flex items-center rounded-md",
    itemActive: "text-white text-md flex items-center rounded-md",
  };
  const nextLang = lang === "sr" ? "en" : "sr";

  const translate = new Translator("navigation");
  const navigate = useNavigate();
  return (
    <header className="flex shadow-sm bg-gray-800 font-[sans-serif] min-h-[70px]">
      <div className="flex flex-wrap items-center justify-between sm:px-10 px-6 py-2 relative lg:gap-y-4 gap-y-6 gap-x-4 w-full">
        <div className="w-[120px] flex">
          <Link to={`/?lang=${lang}`}>
            {" "}
            <img src="/logo3.png" alt="logo" />
          </Link>
        </div>
        <div className="flex">
          <button id="toggleOpen" onClick={toggleOpen}>
            <svg
              className="w-7 h-7"
              fill="#fff"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {true && (
        <div
          id="collapseMenu"
          className={`top-0 right-0 w-[100vw] bg-black bg-opacity-40 p-10 pl-20 text-white fixed h-full z-[100000] ease-in-out duration-300 ${
            isOpen ? "translate-x-0 " : "translate-x-full"
          }`}
        >
          <button
            id="toggleClose"
            onClick={toggleOpen}
            className="fixed top-2 right-4 z-[9999] rounded-full bg-gray-300 p-3"
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
          </button>

          <ul className="block space-x-4 space-y-3 fixed bg-gray-800 w-1/2 min-w-[300px] top-0 left-0 p-4 h-full shadow-md overflow-auto z-[9998]">
            <li>
              <div className="flex flex-wrap items-center">
                <div className="w-[120px] m-auto">
                  <Link to={`/?lang=${lang}`}>
                    {" "}
                    <img src="/logo3.png" alt="logo" />
                  </Link>
                </div>
                <div className="w-full mb-2 mt-4">
                  <p className="text-lg text-center text-gray-300">{name}</p>
                </div>
              </div>
              <hr />
            </li>

            <li className="py-3 px-3">
              <Link
                to={`/market?page=1&lang=${lang}`}
                className={
                  url.includes("/market") ? styleMap.itemActive : styleMap.item
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 w-6 mr-3 inline"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{translate.getTranslation(lang, "marketSearch")}</span>
              </Link>
            </li>

            <li className="py-3 px-3">
              <Link
                to={`/dashboard/search?lang=${lang}`}
                className={
                  url.includes("/dashboard/search")
                    ? styleMap.itemActive
                    : styleMap.item
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 w-6 mr-3 inline"
                >
                  <path
                    fillRule="evenodd"
                    d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{translate.getTranslation(lang, "areaSearch")}</span>
              </Link>
            </li>

            <li className="fixed bottom-20 py-3 px-3">
              <div
                className="text-blue-300 hover:text-blue-400 text-sm flex items-center rounded-md"
                role="button"
                tabIndex={0}
                onKeyDown={() => null}
                onClick={() => {
                  toggleOpen();
                  navigate(switchLanguage(url, nextLang));
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-[18px] h-[18px] mr-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                  />
                </svg>

                <span>
                  {nextLang === "sr" ? "Srpska verzija" : "English version"}
                </span>
              </div>
            </li>

            <li className="fixed bottom-8 py-3 px-3">
              <Link
                to={signOutLink}
                className="text-gray-300 hover:text-white text-lg flex items-center rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 6.35 6.35"
                >
                  <path
                    d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                    data-original="#000000"
                  />
                </svg>
                <span>{translate.getTranslation(lang, "logoutNav")}</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default MobileNavigation;
