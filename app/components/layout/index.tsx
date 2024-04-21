import { createLayoutClasses } from "../../utils/numbers";

export const WidgetWrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <div className="bg-white relative box-border rounded-lg p-5 mb-5 shadow-lg">
      {children}
    </div>
  );
};

export const TLine = ({
  children,
  columns,
  gap = 2,
}: {
  children: JSX.Element | JSX.Element[];
  columns: number;
  gap?: number;
}) => {
  const columnsMap = createLayoutClasses(12, "grid");
  const gapsMap = createLayoutClasses(12, "gap");

  return (
    <div className={`grid ${columnsMap[columns]} grid-rows-1 ${gapsMap[gap]}`}>
      {children}
    </div>
  );
};

export const TColumn = ({
  children,
  span,
  start = 1,
}: {
  children: JSX.Element | JSX.Element[];
  span: number;
  start?: number;
}) => {
  const spanMap = createLayoutClasses(12, "span");
  const startMap = createLayoutClasses(10, "start");

  return (
    <div
      className={`${spanMap[span]} ${startMap[start]} flex flex-col relative box-border px-1 py-0`}
    >
      {children}
    </div>
  );
};

export const TPage = ({
  children,
  color,
  mobile,
}: {
  children: JSX.Element | JSX.Element[];
  color?: string;
  mobile?: boolean;
}) => {
  return (
    <div className={`w-full box-border ${color || "bg-gray-200"} py-4`}>
      <div
        className={`${mobile ? "w-full" : "w-[1366px]"} block relative  m-auto`}
      >
        {children}
      </div>
    </div>
  );
};
