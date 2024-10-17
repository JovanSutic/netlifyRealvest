import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { Translator } from "../data/language/translator";
import { getParamValue, isMobile } from "../utils/params";
import { LangType } from "../types/dashboard.types";
import { FinalError } from "../types/component.types";
import { Blog } from "../types/blog.types";
import BlogCard from "../components/card/BlogCard";
import { TColumn, TLine, TPage } from "../components/layout";

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translate = new Translator("homepage");

  return [
    { title: translate.getTranslation(lang, "blogMetaTitle") },
    {
      name: "description",
      content: translate.getTranslation(lang, "blogMetaDescription"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const page = new URL(request.url).searchParams.get("page") || "1";
  const limit = 10;

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { supabaseClient } = createSupabaseServerClient(request);

    const {
      data: blogData,
      count: blogCount,
      error: blogError,
    } = await supabaseClient
      .from("blogs")
      .select("*", { count: "exact", head: false })
      .eq("language", lang)
      .order("id")
      .range((Number(page) - 1) * limit, limit);

    if (blogError) {
      isError = true;
      finalError = blogError as FinalError;
    }

    return json({
      data: blogData,
      count: blogCount,
      mobile: isMobile(userAgent!),
    });
  } catch (error) {
    console.log(error);
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return {
    data: [],
    mobile: isMobile(userAgent!),
  };
};

const BlogAll = () => {
  const [searchParams] = useSearchParams();

  const translate = new Translator("homepage");

  const lang = (searchParams.get("lang") as LangType) || "sr";
  //   const page = searchParams.get("page") || "1";

  const { data, mobile } = useLoaderData<{
    data: Blog[];
    count: number;
    mobile: boolean;
  }>();

  return (
    <>
      <div className="w-full min-h-[500px] lg:w-[960px] mx-auto py-4 px-2">
        <div className="w-full relative mb-4">
          <div className="w-[140px] mx-auto">
            <Link to={`/?lang=${lang}`}>
              <img
                src="/logo2.png"
                alt="Realvest logo"
                className="max-w-full"
              />
            </Link>
          </div>
          <div className="flex flex-row absolute bottom-0">
            <Link
              to={`/?lang=${lang}`}
              className="text-sm font-regular text-blue-400 underline transform hover:text-blue-500"
            >
              {translate.getTranslation(lang!, "home")}
            </Link>
          </div>
        </div>
        <h2 className="w-full font-bold text-center text-[22px] md:text-[28px] lg:text-[32px] mb-3 md:mb-5 lg:mb-8">
          {translate.getTranslation(lang, "blogTitle")}
        </h2>
        {data?.map((item) => (
          <BlogCard
            key={item.slug}
            lang={lang}
            blog={item as unknown as Blog}
          />
        ))}
        {!data ||
          ((data || []).length === 0 && (
            <p className="mt-4 text-center w-full text-gray-500 text-md">
              {translate.getTranslation(lang, "noBlogs")}
            </p>
          ))}
      </div>
      <TPage color="bg-gray-700" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <footer className="bg-gray-700 p-10 font-[sans-serif] tracking-wide">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="lg:flex">
                  <div className="max-w-[150px]">
                    <img src="logo3.png" alt="logo" className="w-full" />
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
    </>
  );
};

export default BlogAll;
