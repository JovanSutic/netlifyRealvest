import { Link } from "@remix-run/react";
import { LangType } from "../../types/dashboard.types";
import { Translator } from "../../data/language/translator";
import { switchLanguage } from "../../utils/market";

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
    <nav className="bg-gray-800 shadow-lg h-screen fixed top-0 left-0 w-[220px] min-w-[220px]  px-4 pb-4 pt-2 font-[sans-serif] flex flex-col overflow-auto">
      <div className="w-full">
        <div className="w-[120px] m-auto">
          <Link to={`/?lang=${lang}`}>
            {" "}
            <img src="/logo3.png" alt="logo" />
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center">
        <div className="w-full mt-2">
          <p className="text-lg text-center text-gray-300">{name}</p>
        </div>
      </div>

      <hr />

      <ul className="flex-1 mt-4 mb-10">
        <li className="py-3 mb-0.5s">
          <Link
            to={`/market?page=1&lang=${lang}`}
            className={url.includes("/market") ? styleMap.itemActive : styleMap.item}
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
        <li className="py-3 mb-0.5s">
          <Link
            to={`/dashboard/search?lang=${lang}`}
            className={
              url.includes("/dashboard/search") ? styleMap.itemActive : styleMap.item
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

        {/* <li className="py-3 mb-0.5s">
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
        </li> */}
      </ul>

      <ul>
        <li className="mb-8">
          <Link
            to={switchLanguage(url,nextLang)}
            className="text-blue-300 hover:text-blue-400 text-sm flex items-center rounded-md"
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
          </Link>
        </li>
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
