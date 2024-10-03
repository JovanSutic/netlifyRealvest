import { Link } from "@remix-run/react";
import { Blog } from "../../types/blog.types";
import { LangType } from "../../types/dashboard.types";
import { formatDate } from "../../utils/dateTime";

const BlogCard = ({
  blog,
  lang,
  page,
}: {
  blog: Blog;
  lang: LangType;
  page: string;
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row p-2 border-b-[1px] border-gray-300">
      <div className="w-[220px] h-[140px] mx-auto">
        <Link to={`/blog/${blog.slug}/?lang=${lang}`}>
          <img
            src={blog.media_link}
            alt={blog.slug}
            className="w-full max-h-full center rounded-md"
          />
        </Link>
      </div>
      <div className="flex-1 md:pl-2 lg:pl-3 mt-2 lg:mt-0">
        <Link
          to={`/blog/${blog.slug}/?lang=${lang}&page=${page}`}
          className="text-lg lg:text-2xl font-semibold text-black hover:underline"
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
