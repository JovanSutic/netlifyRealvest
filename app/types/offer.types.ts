import { ListedAdType } from "./dashboard.types";

const offerStatus = ["advertized", "bought", "rented", "sold"] as const;
export type OfferStatus = (typeof offerStatus)[number];

export interface Offer {
  id?: number;
  name: string;
  type: ListedAdType;
  maturity: number;
  interest: number;
  price: number;
  total: number;
  size: number;
  rent: number;
  status: OfferStatus;
  description: string;
  description_en: string;
  bonds: number;
  grace: number;
  available: number;
  users_invested: number;
  bonds_owned: number;
  deadline: string | Date;
  rental_tax: number;
  owner_tax: number;
  service_fee: number;
  vacancy_fee: number;
  maintenance_fee: number;
}
