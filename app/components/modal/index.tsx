const Modal = ({
  children,
  open,
  width = "regular",
}: {
  children: JSX.Element;
  open: boolean;
  width?: string;
}) => {
  if (open) {
    return (
      <div className="fixed top-0 left-0 bg-black bg-opacity-40 w-screen h-screen">
        <div className="w-full h-screen flex flex-col align-center justify-center">
          <div className="flex self-center p-4">
            <div
              className={`bg-white rounded-xl w-full md:w-[420px] ${
                width === "large" ? "xl:w-[1060px]" : "xl:w-[560px]"
              } px-4 py-6`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Modal;
