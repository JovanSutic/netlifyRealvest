const ChevronLeft = ({
  style,
  onClick,
}: {
  style: string;
  onClick: () => void;
}) => {
  return (
    <button onClick={onClick} className={style}>
      <div className="bg-white bg-opacity-60 w-[34px] h-[34px] rounded-full text-center hover:bg-opacity-100 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 20"
          fill="currentColor"
          className="size-7 text-center"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
};

export default ChevronLeft;
