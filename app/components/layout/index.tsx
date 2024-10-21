const columnsMap: Record<number, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
  "3": "grid-cols-3",
  "4": "grid-cols-4",
  "5": "grid-cols-5",
  "6": "grid-cols-6",
  "7": "grid-cols-7",
  "8": "grid-cols-8",
  "9": "grid-cols-9",
  "10": "grid-cols-10",
  "11": "grid-cols-11",
  "12": "grid-cols-12",
};

const marginBottomMap: Record<number, string> = {
  "2": "mb-2",
  "4": "mb-4",
  "6": "mb-6",
  "8": "mb-8",
  "10": "mb-10",
  "12": "mb-12",
};

const marginTopMap: Record<number, string> = {
  "2": "mt-2",
  "4": "mt-4",
  "6": "mt-6",
  "8": "mt-8",
  "10": "mt-10",
  "12": "mt-12",
};

const gapsMap: Record<number, string> = {
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "7": "gap-7",
  "8": "gap-8",
  "9": "gap-9",
  "10": "gap-10",
  "11": "gap-11",
  "12": "gap-12",
};

const spanMap: Record<number, string> = {
  "1": "col-span-1",
  "2": "col-span-2",
  "3": "col-span-3",
  "4": "col-span-4",
  "5": "col-span-5",
  "6": "col-span-6",
  "7": "col-span-7",
  "8": "col-span-8",
  "9": "col-span-9",
  "10": "col-span-10",
  "11": "col-span-11",
  "12": "col-span-12",
};

const startMap: Record<number, string> = {
  "1": "col-start-1",
  "2": "col-start-2",
  "3": "col-start-3",
  "4": "col-start-4",
  "5": "col-start-5",
  "6": "col-start-6",
  "7": "col-start-7",
  "8": "col-start-8",
  "9": "col-start-9",
  "10": "col-start-10",
};

export const WidgetWrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <div className="bg-white relative box-border rounded-lg px-2 py-4 md:py-5 md:px-4 mb-2 md:mb-5 shadow-lg">
      {children}
    </div>
  );
};

export const TLine = ({
  children,
  columns,
  gap = 2,
  mb = 0,
  mt = 0,
}: {
  children: JSX.Element | JSX.Element[];
  columns: number;
  gap?: number;
  mb?: number;
  mt?: number;
}) => {
  return (
    <div className={`grid w-full xl:w-[1400px] ${columnsMap[columns]} ${marginBottomMap[mb]} ${marginTopMap[mt]} grid-rows-1 ${gapsMap[gap]} mx-auto`}>
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
    <div
      className={`w-full px-2 lg:px-0 box-border ${
        color || "bg-gray-200"
      } py-4`}
    >
      <div
        className={` w-full block relative ${mobile ? "px-2" : "px-4"} m-auto`}
      >
        {children}
      </div>
    </div>
  );
};

export const DashboardPage = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <div className="pl-0 lg:pl-[220px] min-h-screen bg-gray-100">
      <div className="px-1 md:px-2 lg:px-3">{children}</div>
    </div>
  );
};
