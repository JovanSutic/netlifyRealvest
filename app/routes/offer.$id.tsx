import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { getParamValue, isMobile } from "../utils/params";
import {
  getNotaryFee,
  getPremiumEstimate,
  makeNumberCurrency,
  makeNumberPercent,
} from "../utils/numbers";
import { Translator } from "../data/language/translator";
import { useState, useEffect } from "react";
import { LangType } from "../types/dashboard.types";
import Footer from "../components/layout/Footer";
import PageLoader from "../components/loader/PageLoader";
import NavigationColumn from "../components/navigation/NavigationColumn";
import { User } from "@supabase/supabase-js";
import { Offer, OfferMarketData } from "../types/offer.types";
import Tooltip from "../components/tooltip/Tooltip";
import { formatDate } from "../utils/dateTime";
import { getNumberWithDecimals } from "../utils/market";
import LineReport from "../widgets/LineReport";

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

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const { id } = params;
  console.log(id);
  const { supabaseClient } = createSupabaseServerClient(request);

  try {
    const { data: userData } = await supabaseClient.auth.getUser();
    const offerData: Offer = {
      id: 1,
      name: "Beograd, Slavujev Venac",
      type: "garage",
      price: 12400,
      total: 15500,
      status: "bought",
      maturity: 10,
      size: 12,
      interest: 0.045,
      bonds: 155,
      grace: 1,
      available: 85,
      users_invested: 32,
      rent: 65,
      rental_tax: 9.8,
      owner_tax: 1,
      service_fee: 5.23,
      vacancy_fee: 1.96,
      maintenance_fee: 0,
      insurance_fee: 0,
      deadline: "2025-03-31",
      bonds_owned: 20,
      renovation: 0,
      description:
        "Srpski Srpski Srpski It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      description_en:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    };
    const marketData = {
      labels: [
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
      ],
      prices: [400, 450, 600, 700, 750, 800, 900, 1000, 1050, 1100],
      appreciation: 0.45,
    };
    return {
      mobile: isMobile(userAgent!),
      user: userData.user || null,
      data: offerData,
      marketData,
    };
  } catch (error) {
    console.log(error);
  }

  return {
    mobile: isMobile(userAgent!),
    user: null,
    data: null,
    marketData: null,
  };
};

export default function RestrictedOffer() {
  const [searchParams] = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const lang = (searchParams.get("lang") as LangType) || "sr";
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const {
    mobile,
    user,
    data,
    marketData,
  }: {
    mobile: boolean;
    user: User | null;
    data: Offer;
    marketData: OfferMarketData | null;
  } = useLoaderData();

  const translator = new Translator("knowledge");
  const investmentCost =
    data.price * 0.05 +
    data.price * 0.03 +
    data.price * 0.025 +
    getNotaryFee(data.price) +
    50 +
    data.price * 0.02;
  const bondsNumber = Math.round((investmentCost + data.price) / 100);
  const rentNet =
    data.rent -
    data.owner_tax -
    data.rental_tax -
    data.maintenance_fee -
    data.service_fee -
    data.insurance_fee -
    data.vacancy_fee;
  const bondYearlyIncome = (rentNet * 12) / bondsNumber;

  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname || location.search) {
      setIsNavOpen(false);
    }
  }, [location.pathname, location.search]);

  const dataSet = {
    labels: marketData?.labels || [],
    datasets: [
      {
        label: translator.getTranslation(lang, `chartLabel_${data.type}`),
        data: marketData?.prices || [],
        fill: true,
        backgroundColor: "rgb(147, 197, 253, 0.6)",
        borderColor: "#93c5fd",
        radius: 5,
        hoverRadius: 7,
        pointBackgroundColor: "#60a5fa", //
        pointBorderColor: "#60a5fa",
      },
    ],
  };

  return (
    <>
      <PageLoader open={navigation.state === "loading"} />
      <NavigationColumn
        isOpen={isNavOpen}
        toggleOpen={() => setIsNavOpen(!isNavOpen)}
        lang={lang}
        user={user}
        url={location.pathname}
      />
      <div className="bg-white border-t-[1px] border-gray-200">
        <div className="w-full xl:w-[980px] mx-auto px-2 md:px-8 py-4 lg:py-6">
          <div className="w-full relative mb-4 lg:mb-6 pl-2">
            <div className="flex flex-row">
              <button
                type="button"
                onClick={goBack}
                className="text-blue-500 text-sm underline"
              >
                {translator.getTranslation(lang, "back")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="col-span-2">
              <div className="w-full overflow-hidden h-auto md:h-[400px] lg:h-[360px] rounded-xl mb-2">
                <img
                  src={"/garage.jpg"}
                  alt={"garage"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-between py-0 lg:py-4">
              <div>
                <p className="text-[22px] lg:text-[24px] font-bold text-gray-800">
                  {data.name}
                </p>
                <p className="text-[16px] lg:text-[18px] font-light mt-2 lg:mt-3 mb-3 lg:mb-0">
                  {translator.getTranslation(lang, `type_${data.type}`)}
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-row items-center border-b-[1px] border-t-[1px] border-gray-200 py-3 px-2 min-h-[60px]">
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
                      d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>

                  <span className="font-regular text-gray-600 text-[16px] ml-2">
                    {translator.getTranslation(lang, "interest")}
                  </span>

                  <span className="text-black text-[16px] font-bold ml-3">
                    {makeNumberPercent(((rentNet / bondsNumber) * 12) / 100)}
                  </span>
                </div>

                <div className="flex flex-row items-center border-b-[1px] border-gray-200 py-3 px-2 min-h-[60px]">
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
                  <span className="font-regular text-gray-600 text-[16px] ml-2">
                    {translator.getTranslation(lang, "maturity")}
                  </span>

                  <span className="text-black text-[16px] font-bold ml-3">
                    {`${data.maturity} ${translator.getTranslation(
                      lang,
                      "years"
                    )}`}
                  </span>
                </div>

                <div className="flex flex-row items-center  border-b-[1px] border-gray-200 py-3 px-2 min-h-[60px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-regular text-gray-600 text-[16px] ml-2">
                    {translator.getTranslation(lang, "premium")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="col-span-1 flex lg:hidden flex-col justify-center items-center mb-10 lg:mb-0">
              <div className="w-full flex mb-4">
                <Link
                  to={`/auth/register?lang=${lang}`}
                  className="w-full text-[17px] text-center font-semibold px-4 py-3 bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:bg-blue-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                >
                  {user
                    ? translator.getTranslation(lang, "buyCta")
                    : translator.getTranslation(lang, "buyLoginCta")}
                </Link>
              </div>
              <div className="w-full flex">
                <a
                  href="https://calendly.com/josutic-sutic/inicijalni-sastanak"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-[17px] text-center font-semibold px-4 py-3 bg-gray-500 text-white rounded-xl transition-all duration-300 transform hover:bg-gray-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                >
                  {translator.getTranslation(lang, "callCta")}
                </a>
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-4">
              <div className="flex flex-col justify-center">
                <div className="flex flex-row lg:flex-col items-center px-3">
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
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    />
                  </svg>
                  <span className="text-[16px] lg:text-[15px] text-center font-regular leading-[22px] ml-2 lg:ml-0 lg:mt-2">
                    {translator.getTranslation(lang, "toBuy")}{" "}
                    <span className="font-bold text-[16px] text-black">
                      {data.available}
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex flex-row lg:flex-col items-center px-3">
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
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>

                  <span className="text-[16px] lg:text-[15px] text-center font-regular leading-[22px] ml-2 lg:ml-0 lg:mt-2">
                    {translator.getTranslation(lang, "invested")}{" "}
                    <span className="font-bold text-[16px] text-black">
                      {data.users_invested}
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex flex-row lg:flex-col items-center px-3">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>

                  <span className="text-[16px] lg:text-[15px] text-center font-regular leading-[22px] ml-2 lg:ml-0 lg:mt-2">
                    {translator.getTranslation(lang, "deadline")}{" "}
                    <span className="font-bold text-[16px] text-black">
                      {formatDate(data.deadline, lang)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-1 hidden lg:flex flex-col justify-center items-center">
              <div className="w-full flex justify-center mb-4">
                <a
                  href="https://calendly.com/josutic-sutic/inicijalni-sastanak"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full text-[17px] text-center font-semibold px-4 py-3 bg-gray-500 text-white rounded-xl transition-all duration-300 transform hover:bg-gray-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                >
                  {translator.getTranslation(lang, "callCta")}
                </a>
              </div>
              <div className="w-full flex justify-center">
                <Link
                  to={`/auth/register?lang=${lang}`}
                  className="w-full text-[17px] text-center font-semibold px-4 py-3 bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:bg-blue-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                >
                  {user
                    ? translator.getTranslation(lang, "buyCta")
                    : translator.getTranslation(lang, "buyLoginCta")}
                </Link>
              </div>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 mt-6 mb-8">
            <div>
              <p className="font-semibold text-[18px] mb-2">
                {translator.getTranslation(lang, "propDet")}
              </p>
              <div className="rounded-xl bg-gray-50 border-[1px] border-gray-300 py-4 px-5">
                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "propSize")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "propSizeTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {`${data.size} m2`}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "propType")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "propTypeTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {translator.getTranslation(lang, `type_${data.type}`)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "dealStatus")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "dealStatusTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {translator.getTranslation(lang, `status_${data.status}`)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "propPrice")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "propPriceTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.price)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "dealRent")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "dealRentTip")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.rent)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-[18px] mb-2">
                {translator.getTranslation(lang, "dealDet")}
              </p>
              <div className="rounded-xl bg-gray-50 border-[1px] border-gray-300 py-4 px-5">
                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "dealTotal")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "dealTotalTip")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.total)}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "dealBond")}
                    </span>

                    <Tooltip
                      text={translator.getTranslation(lang, "dealBondTip")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {bondsNumber}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "dealOwned")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "dealOwnedTip")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {`${data.bonds_owned} / ${makeNumberCurrency(
                      data.bonds_owned * 100
                    )}`}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "dealIncome")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "dealIncomeTip")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {`${getNumberWithDecimals(bondYearlyIncome, 2)}€`}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "dealGrace")}
                    </span>

                    <Tooltip
                      text={translator.getTranslation(lang, "dealGraceTip")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {`${data.grace} ${translator.getTranslation(
                      lang,
                      `${data.grace > 1 ? "months" : "month"}`
                    )}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mb-8">
            <p className="font-semibold text-[18px] mb-2">
              {translator.getTranslation(lang, "dealDescription")}
            </p>
            <div className="py-2 px-5">
              <div className="flex flex-row items-center justify-between">
                <p className="text-gray-600 text-[16px]">
                  {lang === "en" ? data.description_en : data.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mb-12">
            <p className="font-semibold text-[18px] mb-2">
              {translator.getTranslation(lang, "chartTitle")}
            </p>
            <div className="px-0 lg:px-6">
              {dataSet && <LineReport data={{ ...dataSet }} />}

              <p className="font-light text-[12px] italic mt-3">
                {translator.getTranslation(lang, "chartSource")}
              </p>
            </div>
            <div className="w-full flex items-center justify-center mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex">
                    <span className="text-center text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "appreciation")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "appreciationTip")}
                      left="left-[-160px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="font-bold text-black text-[22px]">
                    {makeNumberPercent(marketData?.appreciation || 0)}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex">
                    <span className="text-center text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "premiumAmount")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "premiumAmountTip")}
                      left="left-[-160px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="font-bold text-black text-[22px]">
                    {`${getNumberWithDecimals(
                      getPremiumEstimate(
                        data.total,
                        marketData?.appreciation || 0,
                        bondsNumber
                      ),
                      4
                    )}€`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 mb-12">
            <div>
              <p className="font-semibold text-[18px] mb-2">
                {translator.getTranslation(lang, "bondBreakTitle")}
              </p>
              <div className="rounded-xl bg-gray-50 border-[1px] border-gray-300 py-4 px-5">
                <div className="flex flex-col justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[18px] font-semibold">
                      {translator.getTranslation(lang, "bondPrice")}
                    </span>
                  </div>
                  <span className="text-blue-600 text-[24px] font-bold mr-2">
                    {makeNumberCurrency(100)}
                  </span>
                </div>

                <hr />

                <div className="flex flex-row items-center justify-between mt-3 mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investPrice")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "investPriceTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.price)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investRenovation")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(
                        lang,
                        "investRenovationTip"
                      )}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.renovation)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investTax")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "investTaxTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.price * 0.025)}
                  </span>
                </div>
                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investLegal")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "investLegalTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(getNotaryFee(data.price) + 50)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investAgency")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "investAgencyTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.price * 0.03)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investService")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "investServiceTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.price * 0.05)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investUnex")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "investUnexTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.price * 0.02)}
                  </span>
                </div>

                <hr />

                <div className="flex flex-row items-center justify-between mt-3 mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investFull")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "investFullTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(
                      Math.round((investmentCost + data.price) / 100) * 100
                    )}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "investBonds")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "investBondsTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {Math.round((investmentCost + data.price) / 100)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-[18px] mb-2">
                {translator.getTranslation(lang, "incomeBreakTitle")}
              </p>
              <div className="rounded-xl bg-gray-50 border-[1px] border-gray-300 py-4 px-5">
                <div className="flex flex-col justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[18px] font-semibold">
                      {translator.getTranslation(lang, "fixedRate")}
                    </span>
                  </div>
                  <span className="text-blue-600 text-[24px] font-bold mr-2">
                    {makeNumberPercent(((rentNet / bondsNumber) * 12) / 100)}
                  </span>
                </div>

                <hr />

                <div className="flex flex-row items-center justify-between mt-3 mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "rentGross")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "rentGrossTip")}
                      left="left-[-100px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {makeNumberCurrency(data.rent)}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "rentTax")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "rentTaxTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-red-600 text-[16px] font-semibold mr-2">
                    {`-${getNumberWithDecimals(data.rental_tax, 2)}€`}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "ownTax")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "ownTaxTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-red-600 text-[16px] font-semibold mr-2">
                    {`-${getNumberWithDecimals(data.owner_tax, 2)}€`}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "serviceFee")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "serviceFeeTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-red-600 text-[16px] font-bold mr-2">
                    {`-${getNumberWithDecimals(data.service_fee, 2)}€`}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "maintenanceFee")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(
                        lang,
                        "maintenanceFeeTip"
                      )}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-red-600 text-[16px] font-bold mr-2">
                    {`-${getNumberWithDecimals(data.maintenance_fee, 2)}€`}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "vacancyFee")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "vacancyFeeTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-red-600 text-[16px] font-bold mr-2">
                    {`-${getNumberWithDecimals(data.vacancy_fee, 2)}€`}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "insuranceFee")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "insuranceFeeTip")}
                      left="left-[-40px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-red-600 text-[16px] font-bold mr-2">
                    {`-${getNumberWithDecimals(data.insurance_fee, 2)}€`}
                  </span>
                </div>

                <hr />

                <div className="flex flex-row items-center justify-between mb-3 mt-3">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "rentNet")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "rentNetTip")}
                      left="left-[-100px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {`${rentNet}€`}
                  </span>
                </div>

                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-700 text-[16px] font-semibold">
                      {translator.getTranslation(lang, "bondIncome")}
                    </span>
                    <Tooltip
                      text={translator.getTranslation(lang, "bondIncomeTip")}
                      left="left-[-100px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-gray-700 ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </Tooltip>
                  </div>
                  <span className="text-black text-[16px] font-bold mr-2">
                    {`${getNumberWithDecimals(
                      rentNet / Math.round((investmentCost + data.price) / 100),
                      3
                    )}€`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-14">
            <div className="w-full mb-8">
              <div className="w-full lg:w-[50%] mx-auto">
                <div className="w-full flex mb-4">
                  <Link
                    to={`/auth/register?lang=${lang}`}
                    className="w-full text-[17px] text-center font-semibold px-4 py-3 bg-blue-500 text-white rounded-xl transition-all duration-300 transform hover:bg-blue-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                  >
                    {user
                      ? translator.getTranslation(lang, "buyCta")
                      : translator.getTranslation(lang, "buyLoginCta")}
                  </Link>
                </div>
                <div className="w-full flex">
                  <a
                    href="https://calendly.com/josutic-sutic/inicijalni-sastanak"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-[17px] text-center font-semibold px-4 py-3 bg-gray-500 text-white rounded-xl transition-all duration-300 transform hover:bg-gray-600 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                  >
                    {translator.getTranslation(lang, "callCta")}
                  </a>
                </div>
              </div>
            </div>
            <p className="font-semibold text-[18px]">
              {translator.getTranslation(lang, "riskTitle")}
            </p>
            <div className="w-full py-2 px-5">
              <p className="mb-4 text-[16px] text-gray-600">
                {translator.getTranslation(lang, "riskText")}
              </p>
              <p className="font-bold text-[16px]">
                {translator.getTranslation(lang, "riskSub")}
              </p>
              <ul className="list-disc ml-6 mt-4">
                <li className="mb-2 text-[16px] text-gray-600">
                  {translator.getTranslation(lang, "riskA")}
                </li>
                <li className="mb-2 text-[16px] text-gray-600">
                  {translator.getTranslation(lang, "riskB")}
                </li>
                <li className="text-[16px] text-gray-600">
                  {translator.getTranslation(lang, "riskC")}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} mobile={mobile} />
    </>
  );
}
