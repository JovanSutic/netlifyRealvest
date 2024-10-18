import { differenceInDays, format } from "date-fns";
import { useState, useEffect } from "react";
import { RoleType } from "../types/dashboard.types";

function useRoleLimits(id: number, role: RoleType) {
  const [localRole, setLocalRole] = useState<RoleType>(role);

  useEffect(() => {
    const roleLimits = localStorage.getItem("role-limits");
    const today = new Date();
    const limits = `date:${format(today, "yyyy-MM-dd")}|scope:${id}`;

    if (localRole === "guest") {
      if (!roleLimits) {
        setLocalRole("limitedPremium");
        localStorage.setItem("role-limits", limits);
      } else {
        const limitItems = roleLimits.split("|");
        const date = limitItems[0].split(":")[1];
        const scope = limitItems[1].split(":")[1];
        const dateDiff = differenceInDays(today, date);

        if (dateDiff > 0) {
          setLocalRole("limitedPremium");
          localStorage.setItem("role-limits", limits);
        } else {
          const scopeList = scope.split(",");
          if (!scopeList.includes(`${id}`)) {
            if (scopeList.length < 10) {
              scopeList.push(`${id}`);
              setLocalRole("limitedPremium");
              localStorage.setItem(
                "role-limits",
                `date:${format(today, "yyyy-MM-dd")}|scope:${scopeList.join(
                  ","
                )}`
              );
            }
          } else {
            setLocalRole("limitedPremium");
          }
        }
      }
    }
  }, []);

  return [localRole];
}

export default useRoleLimits;
