import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useNavigate,
  useNavigation,
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
import Footer from "../components/layout/Footer";
import PageLoader from "../components/loader/PageLoader";

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

const BlogSingle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const translate = new Translator("homepage");

  const lang = (searchParams.get("lang") as LangType) || "sr";

  const navigation = useNavigation();

  const { data, mobile } = useLoaderData<{
    data: Blog;
    mobile: boolean;
  }>();

  return (
    <>
      <PageLoader open={navigation.state === "loading"} />
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
      <Footer lang={lang} mobile={mobile} />
    </>
  );
};

export default BlogSingle;
