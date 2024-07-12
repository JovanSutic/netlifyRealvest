import { Link } from "@remix-run/react";
import { LangType } from "../../types/dashboard.types";
import { Translator } from "../../data/language/translator";

/* eslint-disable jsx-a11y/anchor-is-valid */
const SideNavigation = ({
  url,
  name,
  signOutLink,
  lang,
}: {
  url: string;
  name: string;
  signOutLink: string;
  lang: LangType;
}) => {
  const styleMap = {
    item: "text-gray-300 hover:text-white text-md flex items-center rounded-md",
    itemActive: "text-white text-md flex items-center rounded-md",
  };

  const nextLang = lang === "sr" ? "en" : "sr";

  const translate = new Translator("navigation");
  return (
    <nav className="bg-gray-700 shadow-lg h-screen fixed top-0 left-0 min-w-[260px] py-6 px-6 font-[sans-serif] flex flex-col overflow-auto">
      <div className="flex flex-wrap items-center">
        <div className="w-full mb-2">
          <p className="text-lg text-center text-gray-300">{name}</p>
        </div>
        <div className="w-full mb-2 text-indigo-300 text-center text-sm underline">
          <Link to={`${url}?lang=${nextLang}`}>
            {nextLang === "sr" ? "srpski" : "english"}
          </Link>
        </div>
      </div>

      <hr />

      <ul className="flex-1 mt-4 mb-10">
        <li className="py-3 mb-0.5s">
          <Link
            to="/dashboard/search"
            className={
              url === "/dashboard/search" ? styleMap.itemActive : styleMap.item
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-5 mr-3 inline"
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
        <li className="py-3 mb-0.5s">
          <Link
            to="/dashboard/rental"
            className={
              url === "/dashboard/rental" ? styleMap.itemActive : styleMap.item
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-5 mr-3 inline"
              viewBox="0 0 20 20"
            >
              <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
              <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
            </svg>
            <span>{translate.getTranslation(lang, "rental")}</span>
          </Link>
        </li>
        <li className="py-3 mb-0.5s">
          <Link
            to="/dashboard/connections"
            className={
              url === "/dashboard/connections"
                ? styleMap.itemActive
                : styleMap.item
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-5 mr-3 inline"
              viewBox="0 0 16 16"
            >
              <path
                d="M13 .5H3A2.503 2.503 0 0 0 .5 3v10A2.503 2.503 0 0 0 3 15.5h10a2.503 2.503 0 0 0 2.5-2.5V3A2.503 2.503 0 0 0 13 .5ZM14.5 13a1.502 1.502 0 0 1-1.5 1.5H3A1.502 1.502 0 0 1 1.5 13v-.793l3.5-3.5 1.647 1.647a.5.5 0 0 0 .706 0L10.5 7.207V8a.5.5 0 0 0 1 0V6a.502.502 0 0 0-.5-.5H9a.5.5 0 0 0 0 1h.793L7 9.293 5.354 7.647a.5.5 0 0 0-.707 0L1.5 10.793V3A1.502 1.502 0 0 1 3 1.5h10A1.502 1.502 0 0 1 14.5 3Z"
                data-original="#000000"
              />
            </svg>
            <span>{translate.getTranslation(lang, "connections")}</span>
          </Link>
        </li>
        <li className="py-3 mb-0.5s">
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
              className="w-5 mr-3 inline"
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
      </ul>

      <ul>
        <li>
          <Link
            to={signOutLink}
            className="text-gray-300 hover:text-white text-sm flex items-center rounded-md"
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
    </nav>
  );
};

export default SideNavigation;
