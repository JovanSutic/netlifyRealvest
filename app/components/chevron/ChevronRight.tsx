const ChevronRight = ({
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
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-7 text-center"
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
};

export default ChevronRight;
