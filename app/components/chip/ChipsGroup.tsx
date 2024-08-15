import ChipTab from "./Chip";

interface ChipsGroupItem {
  text: string;
  value: string | number;
  onClick: () => void;
}

const ChipsGroup = ({
  data,
  current,
  mobile,
}: {
  data: ChipsGroupItem[];
  current: number | string;
  mobile: boolean;
}) => {
  const wrap: string = mobile ? "flex-nowrap" : "flex-wrap";
  const overflow: string = mobile ? "overflow-y-scroll" : "overflow-auto";

  return (
    <div
      className={`w-full flex flex-row ${wrap} ${overflow} pb-4 gap-2`}
    >
      {data.map((item) => (
        <ChipTab
          key={item.text}
          text={item.text}
          active={current === item.value}
          onClick={() => item.onClick()}
        />
      ))}
    </div>
  );
};

export default ChipsGroup;
