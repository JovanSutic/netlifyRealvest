export type DropdownOptions = {
  value: string;
  text: string;
};

export type ColumnSizeType = 1 | 2 | 3 | 4 | 5;

export type ButtonSizeType = "small" | "medium" | "big";
export type ButtonVariantType = "primary" | "secondary" | "tertiary";

export type TableHeader = {
  key: string;
  name: string;
  sortable?: boolean;
  financial?: boolean;
  size?: boolean;
};

const layoutClass = ["grid", "gap", "span", "start"] as const;

export type LayoutClass = (typeof layoutClass)[number];

export type TooltipDirection = "top" | "bottom" | "left" | "right";

export type AlertType = "success" | "warning" | "error" | "info";

export interface AccordionData {
  id: number;
  title: string;
  text: string;
}
