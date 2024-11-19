import { Link } from "@remix-run/react";

const FaqCard = ({ text, link }: { text: string; link: string }) => {
  return (
    <Link to={link}>
      <div className="border-[1px] border-gray-300 rounded-lg grid grid-cols-12 px-4 py-3 justify-between mb-3">
        <p className="text-[16px] font-semibold text-gray-700 col-span-11">
          {text}
        </p>
        <div className="col-span-1 flex flex-row-reverse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 font-bold text-blue-500 leading-[40px] flex self-center text-right"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default FaqCard;
