import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { TColumn, TLine, TPage } from "../components/layout";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { getParamValue, isMobile } from "../utils/params";
import { Translator } from "../data/language/translator";
import Accordion from "../components/accordion";
import { AccordionData } from "../types/component.types";
import { useState } from "react";

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translator = new Translator("homepage");
  return [
    { title: translator.getTranslation(lang, "homeMetaTitle") },
    {
      name: "description",
      content: translator.getTranslation(lang, "homeMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  return json({ ok: true, mobile: isMobile(userAgent!) });
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "sr";
  const translator = new Translator("homepage");
  const [activeFaq, setActiveFaq] = useState<number>(1);

  const accordionData: AccordionData[] = [
    {
      id: 1,
      title: translator.getTranslation(lang, "faq1Title"),
      text: translator.getTranslation(lang, "faq1Text"),
    },
    {
      id: 2,
      title: translator.getTranslation(lang, "faq2Title"),
      text: translator.getTranslation(lang, "faq2Text"),
    },
    {
      id: 3,
      title: translator.getTranslation(lang, "faq3Title"),
      text: translator.getTranslation(lang, "faq3Text"),
    },
    {
      id: 4,
      title: translator.getTranslation(lang, "faq4Title"),
      text: translator.getTranslation(lang, "faq4Text"),
    },
    {
      id: 5,
      title: translator.getTranslation(lang, "faq5Title"),
      text: translator.getTranslation(lang, "faq5Text"),
    },
    {
      id: 6,
      title: translator.getTranslation(lang, "faq6Title"),
      text: translator.getTranslation(lang, "faq6Text"),
    },
  ];

  const {
    mobile,
  }: {
    mobile: boolean;
  } = useLoaderData();

  return (
    <>
      <TPage color="bg-white" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex flex-row justify-center">
                <div className="w-[140px] md:w-[160px]">
                  <img
                    src="logo1.png"
                    alt="Realvest logo"
                    className="max-w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col mt-3 md:mt-0">
                <div className="flex flex-col md:flex-row items-center">
                  <Link
                    to={`auth/?lang=${lang}`}
                    className="text-md px-4 py-2 bg-slate-600 font-semibold text-white rounded-xl transition-all duration-300 transform hover:bg-slate-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                  >
                    {translator.getTranslation(lang, "haveAccount")}
                  </Link>
                  <Link
                    to={`/?lang=${lang === "sr" ? "en" : "sr"}`}
                    className="text-sm font-regular text-blue-500 transform hover:text-blue-700 mt-3 md:mt-0 ml-0 md:ml-6"
                  >
                    {lang === "sr" ? "english version" : "srpska verzija"}
                  </Link>
                </div>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage mobile={mobile}>
        <TLine columns={12} gap={2}>
          <TColumn span={mobile ? 12 : 5}>
            <div className="flex flex-row items-center h-full">
              <div className="flex flex-col items-center pt-8 pb-2 lg:pb-10">
                <h1 className="text-[34px] md:text-[42px] font-extrabold text-center leading-[40px] md:leading-[50px] mb-10">
                  {translator.getTranslation(lang, "heroTitle")}
                </h1>
                <h3 className="text-[18px] md:text-[20px] text-center lg:text-left text-gray-600 leading-8 mb-12">
                  {translator.getTranslation(lang, "heroSubtitle")}
                </h3>
                <Link
                  to={`auth/register/?lang=${lang}`}
                  className="px-6 py-3 text-md font-semibold text-white bg-blue-500 rounded-xl  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                >
                  {translator.getTranslation(lang, "heroCta")}
                </Link>
              </div>
            </div>
          </TColumn>
          <TColumn span={mobile ? 12 : 7} start={mobile ? 1 : 6}>
            <div className="flex flex-col items-center py-10">
              <div className="w-full border-[1px] border-solid border-slate-300 rounded-xl overflow-hidden">
                <img src="firstLineGif.gif" alt="Realvest demo gif" />
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage color="bg-gray-700" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="w-full md:w-[70%] m-auto py-2 mt-5 xl:mt-10 mb-10 xl:mb-[72px]">
              <h3 className="w-full text-2xl md:text-3xl font-semibold text-center text-white">
                {translator.getTranslation(lang, "howTitle")}
              </h3>
            </div>
          </TColumn>
        </TLine>
        <TLine columns={4} gap={6}>
          <TColumn span={mobile ? 4 : 1}>
            <div className="w-full md:w-[60%] xl:w-full m-auto mb-5 xl:mb-0 xl:mt-0">
              <div className="flex flex-col items-center">
                <div className="text-blue-200 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-row mt-2 xl:mt-6 xl:pb-6">
                <p className="w-full text-white text-[18px] md:text-xl text-center">
                  {translator.getTranslation(lang, "howTime")}
                </p>
              </div>
            </div>
          </TColumn>
          <TColumn span={mobile ? 4 : 1} start={mobile ? 1 : 2}>
            <div className="w-full md:w-[60%] xl:w-full m-auto mb-5 xl:mb-0 xl:mt-0">
              <div className="flex flex-col items-center">
                <div className="text-blue-300 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-row mt-2 xl:mt-6">
                <p className="w-full text-white text-[18px] md:text-xl text-center">
                  {translator.getTranslation(lang, "howSize")}
                </p>
              </div>
            </div>
          </TColumn>
          <TColumn span={mobile ? 4 : 1} start={mobile ? 1 : 3}>
            <div className="w-full md:w-[60%] xl:w-full m-auto mb-5 xl:mb-0 xl:mt-0">
              <div className="flex flex-col items-center">
                <div className="text-blue-300 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-16"
                  >
                    <path
                      fillRule="evenodd"
                      d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-row mt-2 xl:mt-6">
                <p className="w-full text-white text-[18px] md:text-xl text-center">
                  {translator.getTranslation(lang, "howCenter")}
                </p>
              </div>
            </div>
          </TColumn>
          <TColumn span={mobile ? 4 : 1} start={mobile ? 1 : 4}>
            <div className="w-full md:w-[60%] xl:w-full m-auto mb-12 xl:mb-0 xl:mt-0">
              <div className="flex flex-col items-center">
                <div className="text-blue-200 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-row mt-2 xl:mt-6">
                <p className="w-full text-white text-[18px] md:text-xl text-center">
                  {translator.getTranslation(lang, "howResult")}
                </p>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage color="bg-white" mobile={mobile}>
        <TLine columns={2} mt={mobile ? 5 : 8}>
          <TColumn span={mobile ? 2 : 1}>
            <div className="py-6 xl:py-10 px-4 md:px-6 mt-6 xl:mt-0">
              <div className="relative w-full flex flex-col h-[200px] md:h-[340px]">
                <img
                  src="place_map.png"
                  alt="Location focus"
                  className="rounded-3xl max-w-full h-full object-fill"
                />
                <div className="absolute w-full h-full block top-0 shadow-[inset_-10px_-10px_60px_40px_rgb(255,255,255)]"></div>
              </div>
            </div>
          </TColumn>
          <TColumn span={mobile ? 2 : 1} start={mobile ? 1 : 2}>
            <div className="py-2 xl:py-16 px-4 xl:px-6 mb-8 xl:mb-0 font-[sans-serif]">
              <h6 className="text-center xl:text-left text-2xl md:text-3xl font-bold mb-4 xl:mb-10 text-slate-800">
                {translator.getTranslation(lang, "benefitFinancial")}
              </h6>
              <p className="text-center xl:text-left text-[18px] xl:text-xl text-slate-600 leading-2xl">
                {translator.getTranslation(lang, "benefitFinancialText")}
              </p>
            </div>
          </TColumn>
        </TLine>
        <TLine columns={2} mb={1}>
          <TColumn span={mobile ? 2 : 1}>
            {mobile ? (
              <div className="py-6 xl:py-10 px-4 md:px-6">
                <div className="relative w-full flex flex-col h-[200px] md:h-[340px]">
                  <img
                    src="data_img.jpeg"
                    alt="Data focus"
                    className="rounded-3xl max-w-full h-full object-fill"
                  />
                  <div className="absolute w-full h-full block top-0 shadow-[inset_-10px_-10px_60px_40px_rgb(255,255,255)]"></div>
                </div>
              </div>
            ) : (
              <div className="py-2 xl:py-16 px-4 md:px-6 font-[sans-serif]">
                <h6 className="text-center xl:text-left text-2xl md:text-3xl font-bold mb-4 xl:mb-10 text-slate-800">
                  {translator.getTranslation(lang, "benefitData")}
                </h6>
                <p className="text-center xl:text-left text-[18px] xl:text-xl text-slate-600 leading-2xl">
                  {translator.getTranslation(lang, "benefitDataText")}
                </p>
              </div>
            )}
          </TColumn>
          <TColumn span={mobile ? 2 : 1} start={mobile ? 1 : 2}>
            {mobile ? (
              <div className="py-2 xl:py-16 px-4 md:px-6 font-[sans-serif]">
                <h6 className="text-center xl:text-left text-2xl md:text-3xl font-bold mb-4 xl:mb-10 text-slate-800">
                  {translator.getTranslation(lang, "benefitData")}
                </h6>
                <p className="text-center xl:text-left text-[18px] xl:text-xl text-slate-600 leading-2xl">
                  {translator.getTranslation(lang, "benefitDataText")}
                </p>
              </div>
            ) : (
              <div className="py-6 xl:py-10 px-4 md:px-6">
                <div className="relative w-full flex flex-col h-[200px] md:h-[340px]">
                  <img
                    src="data_img.jpeg"
                    alt="Data focus"
                    className="rounded-3xl max-w-full h-full object-fill"
                  />
                  <div className="absolute w-full h-full block top-0 shadow-[inset_-10px_-10px_60px_40px_rgb(255,255,255)]"></div>
                </div>
              </div>
            )}
          </TColumn>
        </TLine>
        <TLine columns={1} mb={10}>
          <TColumn span={1}>
            <div className="flex flex-col items-center w-full mt-12 mb-0 xl:mb-6">
              <Link
                to={`auth/register/?lang=${lang}`}
                className="px-6 py-3 text-md md:text-xl xl:text-2xl font-semibold text-white bg-blue-500 rounded-xl  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
              >
                {translator.getTranslation(lang, "heroCta")}
              </Link>
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="w-full py-10 mb-0 md:mb-4">
              <h3 className="text-slate-800 font-bold text-2xl md:text-3xl mb-6 md:mb-8">
                {translator.getTranslation(lang, "faq")}
              </h3>
              <Accordion
                active={activeFaq}
                changeActive={setActiveFaq}
                data={accordionData}
              />
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage color="bg-gray-700" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <footer className="bg-gray-700 p-10 font-[sans-serif] tracking-wide">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="lg:flex lg:items-center">
                  <img src="logo3.png" alt="logo" className="w-52" />
                </div>

                <div className="lg:flex lg:items-center">
                  <ul className="flex space-x-6">
                    <li>
                      <a
                        href="https://www.linkedin.com/company/yourealvest/?viewAsMember=true"
                        target="_blank"
                        rel="noopener noreferrer"
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
                    {translator.getTranslation(lang, "contact")}
                  </h4>
                  <ul className="text-gray-300">
                    <li>office@yourealvest.com</li>
                  </ul>
                </div>

                {/* <div>
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    Information
                  </h4>
                  <ul className="space-y-4">
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        Terms &amp; Conditions
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0)"
                        className="text-gray-300 hover:text-white text-sm"
                      >
                        Privacy Policy
                      </a>
                    </li>
                  </ul>
                </div> */}
              </div>

              <p className="text-gray-300 text-sm mt-10">
                © 2024 Realvest All Rights Reserved.
              </p>
            </footer>
          </TColumn>
        </TLine>
      </TPage>
    </>
  );
}
