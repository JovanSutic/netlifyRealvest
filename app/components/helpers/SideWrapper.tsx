const SideWrapper = ({
  id,
  open,
  children,
  close,
  mobile,
}: {
  id: string;
  open: boolean;
  close: () => void;
  children: JSX.Element | JSX.Element[];
  mobile: boolean;
}) => {
  const containerMt = mobile ? "mt-[80px]" : "mt-0";
  const containerW = mobile ? "w-[100%]" : "w-[360px]";
  const containerRound = mobile ? "rounded-t-xl" : "rounded-top-none";
  
  return (
    <div
      id={id}
      className={
        mobile
          ? `bottom-0 left-0 w-[100%] h-[calc(100%)] bg-black bg-opacity-40 p-10 pl-20 text-white fixed h-full z-[9999] ease-in-out duration-300 ${
              open ? "translate-y-0 " : "translate-y-full"
            }`
          : `top-0 right-0 w-[calc(100%-220px)] bg-black bg-opacity-40 p-10 pl-20 text-white fixed h-full z-[9999] ease-in-out duration-300 ${
              open ? "translate-x-0 " : "translate-x-full"
            }`
      }
      onClick={(e) => {
        if ((e?.target as Element).id == id) {
          close();
        }
      }}
      role="tab"
      tabIndex={0}
      onKeyDown={() => null}
    >
      <div
        className={`block space-x-4 space-y-3 fixed bg-gray-100 ${containerW} top-0 right-0 p-4 h-full shadow-md overflow-auto z-[9998] ${containerMt} ${containerRound}`}
      >
        {children}
      </div>
    </div>
  );
};

export default SideWrapper;
