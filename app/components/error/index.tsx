
import { NavLink } from "@remix-run/react";

export const ErrorPage = ({
  title = "Error",
  subtitle = "The was an issue with your request, please click on the button bellow.",
  buttonText = "Go back to safety",
  link,
}: {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  link: string;
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-center pt-4">
        <p className="text-4xl">{title}</p>
      </div>
      <div className="flex flex-row justify-center">
        <p className="text-base">{subtitle}</p>
      </div>
      <div className="flex flex-row justify-center pt-5">
        <button className="inline-flex mb-1 items-center px-3 py-2 text-sm font-medium text-center text-white bg-indigo-900 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
          <NavLink
            to={link}
            reloadDocument
            className="inline-flex items-center"
          >
            {buttonText}
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
