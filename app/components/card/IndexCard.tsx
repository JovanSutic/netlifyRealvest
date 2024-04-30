import { Link } from "@remix-run/react";

const IndexCard = ({
  title,
  text,
  link,
  buttonText,
  image,
  replaceText,
}: {
  title: string;
  text: string;
  link?: string;
  buttonText?: string;
  image?: string;
  replaceText: string;
}) => {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="h-32">
        <img className="rounded-t-sm max-h-full" src={image || "/empty3.jpg"} alt="dashboard" />
        </div>
      
      <div className="p-5 h-[250px]">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {text}
        </p>
        {link ? (
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <Link to={link} className="inline-flex items-center">
              {buttonText}
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </Link>
          </button>
        ) : (
          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300">
            {replaceText}
          </span>
        )}
      </div>
    </div>
  );
};

export default IndexCard;
