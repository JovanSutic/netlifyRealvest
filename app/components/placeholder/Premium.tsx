import { Link } from "@remix-run/react";
import { LangType } from "../../types/dashboard.types";

const Premium = ({
  subTitle,
  title,
  button,
  lang,
}: {
    title: string;
    subTitle?: string;
  button: string;
  lang: LangType;
}) => {
  return (
    <div className="bg-[url('/blurred_table.jpg')] bg-contain bg-opacity-90">
      <div className="flex flex-col w-full justify-center h-[200px] px-4">
        <div className="w-full flex justify-center mb-2">
          <p className="bg-white px-1 flex items-center text-center font-semibold text-black text-md">
            {title}
          </p>
        </div>
        {subTitle && (
          <div className="w-full flex justify-center mb-5 ">
            <p className="bg-white px-1 flex items-center text-center text-gray-500 text-sm">
              {subTitle}
            </p>
          </div>
        )}

        <div className="w-full flex justify-center">
          <Link
            to={`/auth/register/?lang=${lang}`}
            className="text-md text-blue-950 px-6 py-2 bg-amber-300 font-semibold rounded-md transition-all duration-300 transform hover:bg-amber-400 focus:outline-none disabled:bg-gray-300 disabled:cursor-no-drop"
          >
            {button}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Premium;
