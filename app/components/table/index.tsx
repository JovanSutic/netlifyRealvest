import { useEffect, useState } from "react";
import {
  styled,
  Table as MuiTable,
  TableBody,
  TableCell,
  tableCellClasses,
  tableSortLabelClasses,
  TableContainer,
  TableSortLabel,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { makeNumberCurrency } from "../../utils/numbers";
import { TableHeader } from "../../types/component.types";

const renderTableValue = (reference: string, value: string | number, headers: TableHeader[]): string => {
    const header = headers.find((item) => item.key === reference);
    if (header?.financial) return makeNumberCurrency(value as number);
    if (header?.size) return `${value} m2`;
    return `${value}`;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#06173d",
    color: theme.palette.secondary.main,
    fontSize: 14,
    fontFamily: "Nunito Sans Variable, sans-serif",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledSortLabel = styled(TableSortLabel)(({ theme }) => ({
  [`&.${tableSortLabelClasses.root}`]: {
    color: `${theme.palette.secondary.main} !important`,
    fontSize: 14,
    fontFamily: "Nunito Sans Variable, sans-serif",
  },
  [`.${tableSortLabelClasses.icon}`]: {
    color: `${theme.palette.secondary.main} !important`,
    fontSize: 14,
    fontFamily: "Nunito Sans Variable, sans-serif",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Table<T extends object>({
  headers,
  data,
  height = 500,
}: {
  headers: TableHeader[];
  data: T[];
  height?: number;
}) {
  const [innerData, setInnerData] = useState<T[]>([]);
  const [sort, setSort] = useState<{
    direction: "asc" | "desc";
    column: keyof T;
  }>({ direction: "asc", column: "" as keyof T });

  useEffect(() => {
    if (sort.column) {
      if (sort.direction === "asc") {
        setInnerData(
          [...data].sort(
            (a, b) => (a[sort.column] as number) - (b[sort.column] as number)
          )
        );
      } else {
        setInnerData(
          [...data].sort(
            (a, b) => (b[sort.column] as number) - (a[sort.column] as number)
          )
        );
      }
    }
  }, [sort.column, sort.direction, data]);

  useEffect(() => {
    if (!innerData.length || !sort.column) {
      setInnerData(data);
    }
  }, [data, innerData, sort.column]);
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: height }}>
        <MuiTable
          stickyHeader
          sx={{ minWidth: 700 }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              {headers.map((item) => (
                <StyledTableCell key={item.key} align="right">
                  {item.sortable ? (
                    <StyledSortLabel
                      active={item.key === sort.column}
                      direction={sort.direction}
                      onClick={() => {
                        if (item.key === sort.column) {
                          const direction =
                            sort.direction === "asc" ? "desc" : "asc";
                          setSort({ direction, column: sort.column });
                        } else {
                          setSort({
                            direction: "asc",
                            column: item.key as keyof T,
                          });
                        }
                      }}
                    >
                      {item.name}
                    </StyledSortLabel>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {innerData.map((row) => (
              <StyledTableRow
                key={`row_${JSON.stringify(row)}`}
              >
                {Object.keys(row).map((key, index) => {
                  const reference = headers?.[index]?.key;
                  return (
                    <StyledTableCell
                      key={reference}
                      component="th"
                      align="right"
                      scope="row"
                    >
                      {renderTableValue(reference, row[reference as keyof T] as string, headers)}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </Paper>
  );
}
