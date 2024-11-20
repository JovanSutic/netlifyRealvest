import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useState, useEffect } from "react";
import {
  MetaFunction,
  useLoaderData,
  useLocation,
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
import NavigationColumn from "../components/navigation/NavigationColumn";

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
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const goBack = () => navigate(-1);

  const translate = new Translator("homepage");

  const lang = (searchParams.get("lang") as LangType) || "sr";

  const navigation = useNavigation();
  const location = useLocation();

  const { data, mobile } = useLoaderData<{
    data: Blog;
    mobile: boolean;
  }>();

  useEffect(() => {
    if (location.pathname || location.search) {
      setIsNavOpen(false);
    }
  }, [location.pathname, location.search]);

  return (
    <div className="w-full">
      <PageLoader open={navigation.state === "loading"} />
      <NavigationColumn
        isOpen={isNavOpen}
        toggleOpen={() => setIsNavOpen(!isNavOpen)}
        lang={lang}
        border
        url={location.pathname}
      />
      <div className="w-full xl:w-[1060px] mx-auto px-2 md:px-8 pt-6 lg:pt-8 pb-12">
        <div className="w-full relative pt-4">
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

          <div className="w-full h-[188px] md:h-[266px] lg:h-[316px] md:w-[500px] lg:w-[700px] text-center mx-auto mb-3 md:mb-5 lg:mb-8 rounded-xl overflow-hidden">
            <img
              src={data.media_link}
              alt={data.slug}
              className="w-full h-auto object-contain rounded-xl"
            />
          </div>
        </div>

        <div>
          {data.sections?.map((item) => (
            <BlogSectionItem
              key={item.id}
              content={item.content}
              type={item.type}
              extra={item.extra || ""}
            />
          ))}
        </div>
      </div>
      <Footer lang={lang} mobile={mobile} />
    </div>
  );
};

export default BlogSingle;
