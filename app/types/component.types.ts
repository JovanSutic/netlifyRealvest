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

export interface FinalError {
  message: string;
}

export interface PlanType {
  name: string;
  description: string;
  priceYear: string;
  priceMonth: string;
  isActive: boolean;
  link: string;
  options: {
    name: string;
    active: boolean;
  }[];
}

export type PlanPeriodType = "month" | "year";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof typeof breakpoints;
