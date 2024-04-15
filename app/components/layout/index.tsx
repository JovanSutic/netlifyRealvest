import { Box, SxProps } from "@mui/material";
import { ColumnSizeType } from "../../types/component.types";

export const Page = ({
  children,
  mobile,
  style = {},
  color = "#EAECEF",
}: {
  children: JSX.Element | JSX.Element[];
  mobile: boolean;
  style?: SxProps;
  color?: string;
}) => {
  return (
    <Box
      sx={{
        backgroundColor: color,
        paddingTop: "20px",
        paddingBottom: "28px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: mobile ? "100%" : "1366px",
          margin: "auto",
          display: "block",
          position: "relative",
          ...style,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export const Line = ({
  children,
  mobile,
  style = {},
}: {
  children: JSX.Element | JSX.Element[];
  mobile: boolean,
  style?: SxProps;
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

export const Column = ({
  children,
  size,
}: {
  children: JSX.Element | JSX.Element[];
  size: ColumnSizeType;
}) => {
  const width = size * 20;
  return (
    <Box
      sx={{
        padding: "0px 12px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: 'relative',
        width: `${width}%`
      }}
    >
      {children}
    </Box>
  );
};

export const WidgetWrapper = ({
  children,
  style = {},
}: {
  children: JSX.Element | JSX.Element[];
  style?: SxProps;
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        position: 'relative',
        padding: "20px",
        borderRadius: "8px",
        boxSizing: "border-box",
        boxShadow: "0px 6px 10px -8px rgba(48,48,48,0.85)",
        marginBottom: "20px",
        ...style,
      }}
    >
      {children}
    </Box>
  );
};
