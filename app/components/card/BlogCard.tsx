import { Link } from "@remix-run/react";
import { Blog } from "../../types/blog.types";
import { LangType } from "../../types/dashboard.types";
import { formatDate } from "../../utils/dateTime";

const BlogCard = ({
  blog,
  lang,
  isHome = false,
}: {
  blog: Blog;
  lang: LangType;
  isHome?: boolean;
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center md:flex-row p-2  ${
        !isHome && "border-b-[1px] border-gray-300"
      }`}
    >
      <Link to={`/blog/${blog.slug}/?lang=${lang}`}>
        <div
          //@ts-expect-error ts-ignore
          style={{ "--image-url": `url(${blog.media_link})` }}
          className={`w-[220px] h-[140px] mx-auto bg-[image:var(--image-url)] bg-cover center rounded`}
        ></div>
      </Link>
      <div className="flex-1 md:pl-2 lg:pl-3 mt-2 lg:mt-0">
        <Link
          to={`/blog/${blog.slug}/?lang=${lang}`}
          className={`text-lg ${
            isHome ? "lg:text-xl" : "lg:text-2xl"
          } font-semibold text-black hover:underline`}
        >
          {blog.name}
        </Link>
        <p className="text-sm lg:text-[16px] font-regular text-gray-500 mt-2">
          {blog.description}
        </p>
        <p className="text-[14px] font-semibold text-gray-500 mt-4">
          {formatDate(blog.date_created, lang)}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
