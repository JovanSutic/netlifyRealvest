import { TooltipDirection } from "../../types/component.types";

const Tooltip = ({
  children,
  text,
  direction,
}: {
  children: JSX.Element;
  text: string;
  direction: TooltipDirection;
}) => {
  const classMapDouble: Record<TooltipDirection, string> = {
    top: "absolute w-[220px] z-[999] hidden text-center shadow-lg group-hover:block bg-[#333] text-white font-semibold px-3 py-[6px] text-[12px] left-[-100px] mx-auto w-max top-[-50px] rounded",
    bottom:
      "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-[6px] text-[13px] right-0 left-0 mx-auto w-max -bottom-10 rounded",
    left: "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-2 text-[13px] right-full mr-2 top-0 bottom-0 my-auto h-max w-max rounded",
    right:
      "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-2 text-[13px] left-full ml-3 top-0 bottom-0 my-auto h-max w-max rounded",
  };

  const classMap: Record<TooltipDirection, string> = {
    top: "absolute w-[220px] z-[999] hidden text-center shadow-lg group-hover:block bg-[#333] text-white font-semibold px-3 py-[6px] text-[12px] left-[-50px] mx-auto w-max top-[-50px] rounded",
    bottom:
      "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-[6px] text-[13px] right-0 left-0 mx-auto w-max -bottom-10 rounded",
    left: "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-2 text-[13px] right-full mr-2 top-0 bottom-0 my-auto h-max w-max rounded",
    right:
      "absolute shadow-lg hidden group-hover:block bg-[#333] text-white font-semibold px-3 py-2 text-[13px] left-full ml-3 top-0 bottom-0 my-auto h-max w-max rounded",
  };
  return (
    <div className="relative w-max group mx-auto">
      {children}
      <div className={text.length > 33 ? classMapDouble[direction] : classMap[direction]}>{text}</div>
    </div>
  );
};

export default Tooltip;
