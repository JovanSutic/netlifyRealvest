import { Link } from "@remix-run/react";
import { Translator } from "../../data/language/translator";
import { LangType } from "../../types/dashboard.types";

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
  return (
    <header className="flex shadow-sm bg-indigo-900 font-[sans-serif] min-h-[70px]">
      <div className="flex flex-wrap items-center justify-between sm:px-10 px-6 py-3 relative lg:gap-y-4 gap-y-6 gap-x-4 w-full">
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
      {isOpen && (
        <div
          id="collapseMenu"
          className="before:fixed before:bg-black before:opacity-40 before:inset-0 max-lg:before:z-[9998]"
        >
          <button
            id="toggleClose"
            onClick={toggleOpen}
            className="fixed top-2 right-4 z-[9999] rounded-full bg-white p-3"
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

          <ul className="block space-x-4 space-y-3 fixed bg-indigo-900 w-1/2 min-w-[300px] top-0 left-0 p-4 h-full shadow-md overflow-auto z-[9998]">
            <li>
              <div className="flex flex-wrap items-center">
                <div className="w-full mb-2">
                  <p className="text-lg text-center text-gray-300">{name}</p>
                </div>
                <div className="w-full mb-2 text-indigo-300 text-center text-sm underline">
                  <Link to={`${url}?lang=${nextLang}`}>
                    {nextLang === "sr" ? "srpska verzija" : "english version"}
                  </Link>
                </div>
              </div>
            </li>

            <li className="border-b py-3 px-3">
              <Link
                to="/dashboard/search"
                className={
                  url === "/dashboard/search"
                    ? styleMap.itemActive
                    : styleMap.item
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#FFFFFF"
                  className="w-4 mr-4 inline"
                  viewBox="0 0 118.783 118.783"
                >
                  <path
                    d="M115.97 101.597 88.661 74.286a47.75 47.75 0 0 0 7.333-25.488c0-26.509-21.49-47.996-47.998-47.996S0 22.289 0 48.798c0 26.51 21.487 47.995 47.996 47.995a47.776 47.776 0 0 0 27.414-8.605l26.984 26.986a9.574 9.574 0 0 0 6.788 2.806 9.58 9.58 0 0 0 6.791-2.806 9.602 9.602 0 0 0-.003-13.577zM47.996 81.243c-17.917 0-32.443-14.525-32.443-32.443s14.526-32.444 32.443-32.444c17.918 0 32.443 14.526 32.443 32.444S65.914 81.243 47.996 81.243z"
                    data-original="#000000"
                  />
                </svg>
                <span>{translate.getTranslation(lang, "areaSearch")}</span>
              </Link>
            </li>
            <li className="border-b py-3 px-3">
              <Link
                to="/dashboard/insights"
                className={
                  url === "/dashboard/insights"
                    ? styleMap.itemActive
                    : styleMap.item
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-[18px] h-[18px] mr-4"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M13 .5H3A2.503 2.503 0 0 0 .5 3v10A2.503 2.503 0 0 0 3 15.5h10a2.503 2.503 0 0 0 2.5-2.5V3A2.503 2.503 0 0 0 13 .5ZM14.5 13a1.502 1.502 0 0 1-1.5 1.5H3A1.502 1.502 0 0 1 1.5 13v-.793l3.5-3.5 1.647 1.647a.5.5 0 0 0 .706 0L10.5 7.207V8a.5.5 0 0 0 1 0V6a.502.502 0 0 0-.5-.5H9a.5.5 0 0 0 0 1h.793L7 9.293 5.354 7.647a.5.5 0 0 0-.707 0L1.5 10.793V3A1.502 1.502 0 0 1 3 1.5h10A1.502 1.502 0 0 1 14.5 3Z"
                    data-original="#000000"
                  />
                </svg>
                <span>{translate.getTranslation(lang, "insights")}</span>
              </Link>
            </li>

            <li className="fixed bottom-8">
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
