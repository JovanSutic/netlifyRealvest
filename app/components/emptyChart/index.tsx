const EmptyChart = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="w-full flex flex-col justify-center h-[208px]">
      <p className="text-sm flex flex-col text-center mb-4">
        {title}
      </p>
      <p className="text-xs flex flex-col text-center">
        {subtitle}
      </p>
    </div>
  );
};

export default EmptyChart;
