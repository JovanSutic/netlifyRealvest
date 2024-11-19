import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  json,
  useLoaderData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { getParamValue, isMobile } from "../utils/params";
import { Translator } from "../data/language/translator";
import { useState, useEffect } from "react";
import { LangType } from "../types/dashboard.types";
import Footer from "../components/layout/Footer";
import PageLoader from "../components/loader/PageLoader";
import NavigationColumn from "../components/navigation/NavigationColumn";
import FaqCard from "../components/card/FaqCard";
import { createSupabaseServerClient } from "../supabase.server";
import { FinalError } from "../types/component.types";
import { Blog } from "../types/blog.types";

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
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const { supabaseClient } = createSupabaseServerClient(request);

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { data: blogData, error: blogError } = await supabaseClient
      .from("blogs")
      .select("*")
      .eq("language", lang)
      .not("type", "is", null);

    if (blogError) {
      isError = true;
      finalError = blogError as FinalError;
    }

    return json({
      data: blogData,
      mobile: isMobile(userAgent!),
    });
  } catch (error) {
    console.log(error);
    isError = true;
    finalError = error as FinalError;
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return {
    mobile: isMobile(userAgent!),
    blogs: [],
  };
};

export default function Knowledge() {
  const [searchParams] = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const lang = (searchParams.get("lang") as LangType) || "sr";

  const {
    mobile,
    data,
  }: {
    mobile: boolean;
    data: Blog[];
  } = useLoaderData();

  const translator = new Translator("knowledge");

  const investingQuestions = data.filter((item) => item.type === 'invest');

  const securityQuestions = data.filter((item) => item.type === 'security');

  const propertyQuestion = data.filter((item) => item.type === 'property');

  const bondQuestions = data.filter((item) => item.type === 'bond');

  const supportQuestions = data.filter((item) => item.type === 'support');

  const navigation = useNavigation();
  const location = useLocation();

  console.log(data);

  useEffect(() => {
    if (location.pathname || location.search) {
      setIsNavOpen(false);
    }
  }, [location.pathname, location.search]);
  return (
    <>
      <PageLoader open={navigation.state === "loading"} />
      <NavigationColumn
        isOpen={isNavOpen}
        toggleOpen={() => setIsNavOpen(!isNavOpen)}
        lang={lang}
      />
      <div className="bg-white border-t-[1px] border-gray-300">
        <div className="w-full xl:w-[1260px] mx-auto px-2 md:px-8 pt-6 lg:pt-8">
          <h1 className="w-full text-center text-[34px] lg:text-[40px] font-bold">
            {translator.getTranslation(lang, "title")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mt-8 lg:mt-14 pb-16">
            <div className="flex flex-col">
              <div className="px-2 flex flex-row items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-7 text-green-400 mr-2"
                >
                  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
                </svg>

                <h3 className="text-[24px] text-gray-800 font-semibold underline">
                  {translator.getTranslation(lang, "investSub")}
                </h3>
              </div>
              <div className="w-full flex flex-col">
                {investingQuestions.map((item) => {
                  return (
                    <FaqCard
                      key={`invest_${item.id}`}
                      text={item.name}
                      link={`/blog/${item.slug}/?lang=${lang}`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="px-2 flex flex-row items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-7 text-indigo-500 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5Zm6.61 10.936a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                  <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                </svg>
                <h3 className="text-[24px] text-gray-800 font-semibold underline">
                  {translator.getTranslation(lang, "bondSub")}
                </h3>
              </div>
              <div className="w-full flex flex-col">
                {bondQuestions.map((item) => {
                  return (
                    <FaqCard
                      key={`bond_${item.id}`}
                      text={item.name}
                      link={`/blog/${item.slug}/?lang=${lang}`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="px-2 flex flex-row items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-7 text-amber-500 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-[24px] text-gray-800 font-semibold underline">
                  {translator.getTranslation(lang, "securitySub")}
                </h3>
              </div>
              <div className="w-full flex flex-col">
                {securityQuestions.map((item) => {
                  return (
                    <FaqCard
                      key={`security_${item.id}`}
                      text={item.name}
                      link={`/blog/${item.slug}/?lang=${lang}`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="px-2 flex flex-row items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-7 text-red-400 mr-2"
                >
                  <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
                  <path
                    fillRule="evenodd"
                    d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-[24px] text-gray-800 font-semibold underline">
                  {translator.getTranslation(lang, "propertySub")}
                </h3>
              </div>
              <div className="w-full flex flex-col">
                {propertyQuestion.map((item) => {
                  return (
                    <FaqCard
                      key={`property_${item.id}`}
                      text={item.name}
                      link={`/blog/${item.slug}/?lang=${lang}`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="px-2 flex flex-row items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-7 text-blue-500 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-[24px] text-gray-800 font-semibold underline">
                  {translator.getTranslation(lang, "supportSub")}
                </h3>
              </div>
              <div className="w-full flex flex-col">
                {supportQuestions.map((item) => {
                  return (
                    <FaqCard
                      key={`support_${item.id}`}
                      text={item.name}
                      link={`/blog/${item.slug}/?lang=${lang}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer lang={lang} mobile={mobile} />
    </>
  );
}
