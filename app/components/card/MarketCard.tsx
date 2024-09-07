import { Link } from "@remix-run/react";

const MarketCard = ({
  photo,
  title,
  duration,
  link,
  highlight,
  value,
}: {
  photo: string;
  title: string;
  duration: string;
  link: string;
  highlight: string;
  value: string;
}) => {
  return (
    <Link to={link} className="bg-white rounded-xl cursor-pointer hover:-translate-y-1 transition-all relative shadow-lg">
      <div className="px-2 py-1 absolute right-2 top-2 text-sm bg-gray-700 text-white bg-opacity-60 rounded-xl">
        {highlight}
      </div>

      <div className="w-full h-[180px] overflow-hidden rounded-t-xl mb-4">
        <img
          src={photo}
          alt="Product 1"
          className="h-full w-full object-center"
        />
      </div>

      <div className="px-4 mb-2">
        <h3 className="text-sm font-semibold text-black">{title}</h3>
        <p className="">
          <span className="text-gray-600 font-thin mr-2 text-sm">
            {`${highlight}:`}
          </span>
          <span className="text-blue-500 text-md font-bold">{value}</span>
        </p>
        <p className="mt-2 text-gray-400 text-[13px] font-thin">{duration}</p>
      </div>
    </Link>
  );
};

export default MarketCard;
