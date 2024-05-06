import { Typography } from "@mui/material";

const EmptyChart = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="w-full flex flex-col justify-center h-[208px]">
      <Typography
        component="h6"
        variant="subtitle1"
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          marginBottom: "16px",
          fontWeight: "500",
        }}
      >
        {title}
      </Typography>
      <Typography
        component="h6"
        variant="subtitle2"
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          fontWeight: "400",
        }}
      >
        {subtitle}
      </Typography>
    </div>
  );
};

export default EmptyChart;
