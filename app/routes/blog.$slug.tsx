import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { Translator } from "../data/language/translator";
import { isMobile } from "../utils/params";
import { LangType } from "../types/dashboard.types";
import { FinalError } from "../types/component.types";
import { Blog } from "../types/blog.types";
import BlogSectionItem from "../widgets/BlogSectionItem";
import { formatDate } from "../utils/dateTime";
import { TColumn, TLine, TPage } from "../components/layout";

export const meta: MetaFunction = ({ data }) => {
  const { data: loadingData } = data as { data: Blog };
  return [
    { title: loadingData.name },
    {
      name: "description",
      content: loadingData.description,
    },
  ];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const { slug } = params;

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { supabaseClient } = createSupabaseServerClient(request);

    const { data: blogData, error: blogError } = await supabaseClient
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .limit(1);

    if (blogError) {
      isError = true;
      finalError = blogError as FinalError;
    }

    if (!blogData || !blogData.length) {
      isError = true;
      finalError = { message: "no blog with this slug" } as FinalError;
    }

    const { data: sectionData, error: sectionError } = await supabaseClient
      .from("blogs_content")
      .select("*")
      .eq("blog_id", blogData?.[0].id)
      .order("sequence");

    if (sectionError) {
      isError = true;
      finalError = sectionError as FinalError;
    }

    return json({
      data: { ...blogData![0], sections: sectionData },
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
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const translate = new Translator("homepage");

  const lang = (searchParams.get("lang") as LangType) || "sr";

  const { data, mobile } = useLoaderData<{
    data: Blog;
    mobile: boolean;
  }>();

  return (
    <>
      <div className="w-full lg:w-[960px] mx-auto py-4 px-2 mb-6">
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
            <button
              type="button"
              onClick={goBack}
              className="text-blue-500 text-sm underline"
            >
              {translate.getTranslation(lang, "back")}
            </button>
          </div>
        </div>
        <div>
          <p className="w-full mb-2 text-gray-500 text-md text-right">{`${translate.getTranslation(
            lang!,
            "blogDate"
          )}: ${formatDate(data.date_created, lang)}`}</p>
          <h2 className="w-full font-bold text-center text-[22px] md:text-[28px] lg:text-[32px] mb-4">
            {data.name}
          </h2>

          <div className="w-full md:w-[500px] lg:w-[700px] text-center mx-auto mb-3 md:mb-5 lg:mb-8">
            <img
              src={data.media_link}
              alt={data.slug}
              className="max-w-full center"
            />
          </div>
        </div>

        <div>
          {data.sections?.map((item) => (
            <BlogSectionItem
              key={item.id}
              content={item.content}
              type={item.type}
            />
          ))}
        </div>
      </div>
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
