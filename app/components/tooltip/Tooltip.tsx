const Tooltip = ({
  children,
  text,
  top = "top-[24px]",
  left = "left-[-100px]",
}: {
  children: JSX.Element;
  text: string;
  top?: string;
  left?: string;
}): JSX.Element => {
  return (
    <div className="relative w-max group mx-auto cursor-pointer">
      {children}
      <div className={`absolute w-[220px] z-[999] hidden text-center shadow-lg group-hover:block bg-gray-700 text-white font-semibold px-3 py-[6px] text-[12px] ${left} mx-auto ${top} rounded z-99999999`}>{text}</div>
    </div>
  );
};

export default Tooltip;
