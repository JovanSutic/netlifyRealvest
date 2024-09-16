import { TooltipDirection } from "../../types/component.types";

const Tooltip = ({
  children,
  text,
  style,
}: {
  children: JSX.Element;
  text: string;
  style: TooltipDirection;
}): JSX.Element => {

  const classMap: Record<TooltipDirection, string> = {
    top: "absolute w-[220px] z-[999] hidden text-center shadow-lg group-hover:block bg-[#333] text-white font-semibold px-3 py-[6px] text-[12px] left-[-270px] mx-auto top-[-10px] rounded z-999999999",
    bottom:
      "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-[6px] text-[13px] right-0 left-0 mx-auto w-max -bottom-10 rounded",
    left: "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-2 text-[13px] right-full mr-2 top-0 bottom-0 my-auto h-max w-max rounded",
    right:
      "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-2 text-[13px] left-full ml-3 top-0 bottom-0 my-auto h-max w-max rounded",
  };
  return (
    <div className="relative w-max group mx-auto cursor-pointer">
      {children}
      <div className={classMap[style as keyof typeof classMap]}>{text}</div>
    </div>
  );
};

export default Tooltip;
