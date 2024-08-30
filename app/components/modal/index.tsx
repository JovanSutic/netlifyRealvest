const Modal = ({
  children,
  open,
}: {
  children: JSX.Element;
  open: boolean;
}) => {
  if (open) {
    return (
      <div className="fixed top-0 left-0 bg-black bg-opacity-40 w-screen h-screen">
        <div className="w-full h-screen flex flex-col align-center justify-center">
          <div className="flex self-center p-4">
            <div className="bg-white rounded-xl w-full md:w-[420px] xl:w-[560px] px-4 py-6">
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
