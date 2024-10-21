/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
const Pagination = ({
  page,
  total,
  onClick,
}: {
  page: number;
  total: number;
  onClick: (page: number) => void;
}) => {
  const getFirst = () => {
    if (page === 1) return page;
    if (page === total) return page - 2;

    return page - 1;
  };
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
  const first = getFirst();
  const last = getLast();
  const second = getMiddle();

  const activeStyle = "bg-blue-500 text-white";
  const passiveStyle = "cursor-pointer bg-gray-200 text-black";
  const activeButton = "cursor-pointer bg-blue-500 text-white";
  const disabledButton = "cursor-no-drop bg-gray-300";

  if (page <= total && total > 1) {
    return (
      <div className="w-full border-t-[1px] border-gray-300 mb-4">
        <ul className="flex space-x-1 md:space-x-3 justify-center mt-4">
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
              className={`w-3 ${page === 1 ? "fill-gray-500" : "fill-white"}`}
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
          {total > 3 && page > 2 && (
            <>
              <li
                className={`flex items-center justify-center shrink-0 w-10 h-8 rounded text-sm font-bold ${
                  1 === page ? activeStyle : passiveStyle
                }`}
                onClick={() => (1 === page ? null : onClick(1))}
                role="button"
                onKeyDown={() => null}
                tabIndex={0}
              >
                {1}
              </li>
              <li className="font-bold text-lg">...</li>
            </>
          )}
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
          {total > 2 && (
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
          )}
          {total > 3 && page + 1 < total && (
            <>
              <li className="font-bold text-lg">...</li>
              <li
                className={`flex items-center justify-center shrink-0 w-10 h-8 rounded text-sm font-bold ${
                  total === page ? activeStyle : passiveStyle
                }`}
                onClick={() => (total === page ? null : onClick(total))}
                role="button"
                onKeyDown={() => null}
                tabIndex={0}
              >
                {total}
              </li>
            </>
          )}

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
              className={`w-3 rotate-180 ${
                page === total ? "fill-gray-500" : "fill-white"
              }`}
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
        </ul>
      </div>
    );
  }

  return null;
};

export default Pagination;
