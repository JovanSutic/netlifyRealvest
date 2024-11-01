import { Link } from "@remix-run/react";
import { Blog } from "../../types/blog.types";
import { LangType } from "../../types/dashboard.types";
import { formatDate } from "../../utils/dateTime";

const BlogCard = ({
  blog,
  lang,
  isHome = false,
  isBorder = true,
}: {
  blog: Blog;
  lang: LangType;
  isHome?: boolean;
  isBorder?: boolean;
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center md:flex-row p-2  ${
        !isHome && isBorder && "border-b-[1px] border-gray-300"
      }`}
    >
      <Link to={`/blog/${blog.slug}/?lang=${lang}`}>
        <div
          //@ts-expect-error ts-ignore
          style={{ "--image-url": `url(${blog.media_link})` }}
          className={`w-[220px] h-[140px] mx-auto bg-[image:var(--image-url)] bg-cover center rounded-md`}
        ></div>
      </Link>
      <div className="w-full flex flex-col self-start md:pl-2 lg:pl-3">
        <Link to={`/blog/${blog.slug}/?lang=${lang}`}>
          <span
            className={`block text-center md:text-left text-md lg:text-lg font-semibold text-black hover:underline`}
          >
            {blog.name}
          </span>
        </Link>
        <p className="text-center md:text-left text-sm lg:text-[15px] font-regular text-gray-500 mt-2">
          {blog.description}
        </p>
        <p className="text-center md:text-left text-[14px] font-semibold text-gray-500 mt-2">
          {formatDate(blog.date_created, lang)}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
