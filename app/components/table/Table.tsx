import { makeNumberCurrency } from "../../utils/numbers";
import { TableHeader } from "../../types/component.types";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

const renderTableValue = (
  reference: string,
  value: string | number,
  headers: TableHeader[]
): string => {
  const header = headers.find((item) => item.key === reference);
  if (header?.financial) return makeNumberCurrency(value as number);
  if (header?.size) return `${value} m2`;
  return `${value}`;
};

const Table = <T extends object>({
  headers,
  data,
  isPagination = false,
  isHeader = false,
}: {
  headers: TableHeader[];
  data: T[];
  isPagination?: boolean;
  isHeader?: boolean;
}) => {
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
    <section className={`${styles["md-ui"]} ${styles["component-data-table"]}`}>
      {isHeader ? (
        <header className={styles["main-table-header"]}>
          <h1 className={styles["table-header--title"]}>Nutrition</h1>
          <span className={styles["table-header--icons"]}>
            <i className={styles["material-icons"]}>filter_list</i>
            <i className={styles["material-icons"]}>more_vert</i>
          </span>
        </header>
      ) : null}

      <div className={styles["main-table-wrapper"]}>
        <table className={styles["main-table-content"]}>
          <thead className={styles["data-table-header"]}>
            <tr className={styles["data-table-row"]}>
              {headers.map((item) => (
                <td
                  className={`${
                    item.sortable && styles["sortable"]} ${styles["datatype-string"]} ${sort.column === item.key &&styles["active-sort"]}`}
                  key={item.key}
                  onClick={() => {
                    if (item.sortable) {
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
                    }
                  }}
                >
                  {" "}
                  {/* {sort.column === item.key ? (
                    
                  ) : null} */}
                  <div className={sort.direction === "asc" ? styles["triangle-bottom"] : styles["triangle-top"]}></div>
                  {item.name}
                </td>
              ))}
            </tr>
          </thead>
          <tbody className={styles["data-table-content"]}>
            {innerData.map((row, index) => (
              <tr
                className={`${styles["data-table-row"]} ${index % 2 ? styles["odd-row"] : undefined}`}
                key={`row_${JSON.stringify(row)}`}
              >
                {Object.keys(row).map((key, index) => {
                  const reference = headers?.[index]?.key;
                  return (
                    <td
                      className={`${styles["table-datacell"]} ${styles["datatype-string"]}`}
                      key={reference}
                    >
                      {renderTableValue(
                        reference,
                        row[reference as keyof T] as string,
                        headers
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isPagination ? (
        <footer className={styles["main-table-footer"]}>
          <span className={styles["rows-selection"]}>
            <span className={styles["rows-selection-label"]}>
              Rows per page:
            </span>
            <span className={styles["rows-selection-dropdown"]}>
              10<i className={styles["material-icons"]}>arrow_drop_down</i>
            </span>
          </span>
          <span className={styles["rows-amount"]}>1-10 of 100</span>
          <span className={styles["table-pagination"]}>
            <i className={styles["material-icons"]}>keyboard_arrow_left</i>
            <i className={styles["material-icons"]}>keyboard_arrow_right</i>
          </span>
        </footer>
      ) : null}
    </section>
  );
};

export default Table;
