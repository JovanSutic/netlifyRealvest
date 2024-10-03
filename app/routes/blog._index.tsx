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
  const page = searchParams.get("page") || "1";

  const { data } = useLoaderData<{
    data: Blog[];
    count: number;
    mobile: boolean;
  }>();

  return (
    <div className="w-full lg:w-[960px] mx-auto py-4 px-2">
      <div className="w-full relative mb-4">
        <div className="w-[140px] mx-auto">
          <Link to={`/?lang=${lang}`}>
            <img src="/logo2.png" alt="Realvest logo" className="max-w-full" />
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
          page={page}
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
  );
};

export default BlogAll;
