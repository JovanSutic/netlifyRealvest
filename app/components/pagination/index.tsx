/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
const Pagination = ({
  page,
  total,
  title,
  totalText,
  onClick,
}: {
  page: number;
  total: number;
  title: string;
  totalText: string;
  onClick: (page: number) => void;
}) => {
  const getMiddle = () => {
    if (page === 1) return page + 1;
    if (page === total) return page - 1;

    return page;
  };
  const getLast = () => {
    if (page === 1) return page + 2;
    if (page === total) return page;

    return page + 1;
  };
  const first = page === 1 ? page : page - 1;
  const last = getLast();
  const second = getMiddle();

  const activeStyle = "bg-blue-500 text-white";
  const passiveStyle = "cursor-pointer bg-gray-200 text-black";
  const activeButton = "cursor-pointer bg-gray-300";
  const disabledButton = "cursor-no-drop bg-gray-200";

  if (page <= total) {
    return (
      <div className="w-full border-t-[1px] border-gray-500">
        <p className="w-full text-center text-md my-3 ">
          <span className="text-gray-600 font-semibold text-[12px]">{`${title.toUpperCase()}`}</span>
        </p>
        <ul className="flex space-x-3 justify-center">
          <li
            className={`flex items-center justify-center shrink-0 w-10 h-8 rounded ${
              page === 1 ? disabledButton : activeButton
            }`}
            onClick={() => (page === 1 ? null : onClick(page - 1))}
            role="button"
            onKeyDown={() => null}
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 fill-gray-500"
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
          <li
            className={`flex items-center justify-center shrink-0 w-10 h-8 rounded text-sm font-bold ${
              first === page ? activeStyle : passiveStyle
            }`}
            onClick={() => (first === page ? null : onClick(first))}
            role="button"
            onKeyDown={() => null}
            tabIndex={0}
          >
            {first}
          </li>
          <li
            className={`flex items-center justify-center shrink-0 w-10 h-8 rounded text-sm font-bold ${
              second === page ? activeStyle : passiveStyle
            }`}
            onClick={() => (second === page ? null : onClick(second))}
            role="button"
            onKeyDown={() => null}
            tabIndex={0}
          >
            {second}
          </li>
          <li
            className={`flex items-center justify-center shrink-0  w-10 h-8 rounded text-sm font-bold ${
              last === page ? activeStyle : passiveStyle
            }`}
            onClick={() => (last === page ? null : onClick(last))}
            role="button"
            onKeyDown={() => null}
            tabIndex={0}
          >
            {last}
          </li>
          <li
            className={`flex items-center justify-center shrink-0 w-10 h-8 rounded ${
              page === total ? disabledButton : activeButton
            }`}
            onClick={() => (page === total ? null : onClick(page + 1))}
            role="button"
            onKeyDown={() => null}
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 fill-gray-500 rotate-180"
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
        </ul>
        <p className="w-full text-center text-md my-3 ">
          <span className="text-gray-600 font-semibold text-[12px]">{`${totalText.toUpperCase()}:`}</span>
          <span className="ml-2 text-gray-800 text-md font-extrabold">{`${total}`}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default Pagination;
