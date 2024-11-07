import { DashboardPage } from "../components/layout";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { getParamValue, isMobile } from "../utils/params";
import { Translator } from "../data/language/translator";
import { FinalError } from "../types/component.types";
import {
  getNumberWithDecimals,
  isNewFromDesc,
  isForRenovation,
} from "../utils/market";
import { makeNumberCurrency } from "../utils/numbers";
import Modal from "../components/modal";
import ToggleButton from "../components/toggleButtons/ToggleButton";
import { useState } from "react";

interface OpportunityListItem {
  id: number;
  name: string;
  link: string;
  date_created: Date | string;
  size: number;
  price: number;
  city_part: string;
  average_rental: number;
  rental_count: number;
  competition_trend: number;
  floor: number;
  floor_limit: number;
  lat: number;
  lng: number;
  description: string;
  rent_ratio: number;
  price_ratio: number;
}

const truncateString = (str: string, maxLength: number = 40): string => {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + "...";
  }
};

const calculateNotaryFee = (price: number): number => {
  return getNumberWithDecimals(price * 0.0033, 2);
};

const calculateAbsoluteTax = (price: number): number => {
  return getNumberWithDecimals(price * 0.025, 2);
};

const calculateExtraTax = (price: number): number => {
  return getNumberWithDecimals(price * 0.1, 2);
};

const calculateAgentFee = (price: number): number => {
  return getNumberWithDecimals(price * 0.03, 2);
};

const getFullPrice = (price: number, description: string): number => {
  const isNew = isNewFromDesc(description);
  const tax = isNew ? calculateExtraTax(price) : calculateAbsoluteTax(price);
  return (
    price + tax + 40 + calculateNotaryFee(price) + calculateAgentFee(price)
  );
};

const getFurnitureCost = (size: number, needsRenovation: boolean): number => {
  const m2Expense = needsRenovation ? 750 : 300;
  return getNumberWithDecimals(size * m2Expense, 2);
};

const getPurchaseFee = (
  price: number,
  description: string,
  size: number
): number => {
  const isRenovation = isForRenovation(description);
  return (
    (getFullPrice(price, description) + getFurnitureCost(size, isRenovation)) *
    0.02
  );
};

const getM2Price = (
  price: number,
  description: string,
  size: number
): number => {
  const isRenovation = isForRenovation(description);
  const fullPrice =
    getFullPrice(price, description) + getFurnitureCost(size, isRenovation);
  return getNumberWithDecimals((fullPrice + fullPrice * 0.03) / size, 2);
};

const getRentGross = (rent: number, size: number) => {
  return getNumberWithDecimals(rent * size * 1.2, 2);
};

const getRentTax = (rent: number, size: number) => {
  const gross = getRentGross(rent, size);
  return getNumberWithDecimals((gross - gross * 0.2) * 0.2, 2);
};

const getRentNet = (rent: number, size: number) => {
  return getRentGross(rent, size) - getRentTax(rent, size);
};

const getRentFee = (rent: number, size: number) => {
  return getNumberWithDecimals(getRentNet(rent, size) * 0.08, 2);
};

const getRentAmortization = (rent: number, size: number) => {
  return getNumberWithDecimals(getRentNet(rent, size) * 0.15, 2);
};

const getRentRevenue = (rent: number, size: number) => {
  return (
    getRentNet(rent, size) -
    getRentFee(rent, size) -
    getRentAmortization(rent, size)
  );
};

const getRentRevenueM2 = (rent: number, size: number) => {
  return getNumberWithDecimals(getRentRevenue(rent, size) / size, 2);
};

const getRentRevenueM2Yearly = (rent: number, size: number) => {
  return getRentRevenueM2(rent, size) * 12;
};

const getRentROI = (
  rent: number,
  price: number,
  description: string,
  size: number
) => {
  return getNumberWithDecimals(
    (getRentRevenueM2Yearly(rent, size) /
      getM2Price(price, description, size)) *
      100,
    2
  );
};

const highlightRoi = (
  rent: number,
  price: number,
  description: string,
  size: number
): string => {
  const roi = getRentROI(rent, price, description, size);

  if (roi > 5) return "bg-green-100";
  if (roi > 4) return "bg-blue-100";
  if (roi > 3) return "bg-amber-100";

  return "bg-white";
};

const highlightPriceM2 = (
  price: number,
  description: string,
  size: number
): string => {
  const m2Price = getM2Price(price, description, size);
  if (m2Price <= 3000) return "bg-green-100";
  if (m2Price <= 4000) return "bg-blue-100";
  if (m2Price <= 5000) return "bg-amber-100";

  return "bg-white";
};

const highlightRentGross = (rent: number, size: number): string => {
  const gross = getRentGross(rent, size);
  if (gross <= 500) return "bg-green-100";
  if (gross <= 700) return "bg-blue-100";
  if (gross <= 1000) return "bg-amber-100";

  return "bg-white";
};

const TableHeader = ({ short = false }: { short?: boolean }) => {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-4 py-3">
          Name
        </th>
        <th scope="col" className="px-4 py-3">
          ID
        </th>
        <th scope="col" className="px-4 py-3">
          City Part
        </th>
        <th scope="col" className="px-4 py-3">
          Size
        </th>
        <th scope="col" className="px-4 py-3">
          Price
        </th>
        <th scope="col" className="px-4 py-3">
          Furnish
        </th>
        <th scope="col" className="px-4 py-3">
          Fee
        </th>
        <th scope="col" className="px-4 py-3">
          Price m2
        </th>
        <th scope="col" className="px-4 py-3">
          Rent m2
        </th>
        <th scope="col" className="px-4 py-3">
          Rent gros
        </th>
        <th scope="col" className="px-4 py-3">
          Rent net
        </th>
        <th scope="col" className="px-4 py-3">
          Rent tax
        </th>
        <th scope="col" className="px-4 py-3">
          Rent fee
        </th>
        <th scope="col" className="px-4 py-3">
          Rent amort
        </th>
        <th scope="col" className="px-4 py-3">
          Revenue
        </th>
        <th scope="col" className="px-4 py-3">
          Revenue m2
        </th>
        <th scope="col" className="px-4 py-3">
          Y revenue m2
        </th>
        <th scope="col" className="px-4 py-3">
          Y ROI
        </th>
        <th scope="col" className="px-4 py-3">
          DATE
        </th>
        {!short && (
          <>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Link</span>
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Calc</span>
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </>
        )}
      </tr>
    </thead>
  );
};

const TableRow = ({
  item,
  onCalc,
  short = false,
}: {
  item: OpportunityListItem;
  onCalc: () => void;
  short?: boolean;
}) => {
  return (
    <tr
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      key={item.id}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        title={item.name}
      >
        {truncateString(item.name)}
      </th>
      <td className="px-4 py-3">{item.id}</td>
      <td className="px-4 py-3">{item.city_part}</td>
      <td className="px-4 py-3">{item.size}</td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getFullPrice(item.price, item.description))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(
          getFurnitureCost(item.size, isForRenovation(item.description))
        )}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(
          getPurchaseFee(item.price, item.description, item.size)
        )}
      </td>
      <td
        className={`px-4 py-3 ${highlightPriceM2(
          item.price,
          item.description,
          item.size
        )}`}
      >
        {makeNumberCurrency(
          getM2Price(item.price, item.description, item.size)
        )}
      </td>
      <td className="px-4 py-3">{makeNumberCurrency(item.average_rental)}</td>
      <td
        className={`px-4 py-3 ${highlightRentGross(
          item.average_rental,
          item.size
        )}`}
      >
        {makeNumberCurrency(getRentGross(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentNet(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentTax(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentFee(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(
          getRentAmortization(item.average_rental, item.size)
        )}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentRevenue(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentRevenueM2(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(
          getRentRevenueM2Yearly(item.average_rental, item.size)
        )}
      </td>
      <td
        className={`px-4 py-3 ${highlightRoi(
          item.average_rental,
          item.price,
          item.description,
          item.size
        )}`}
      >
        {getRentROI(
          item.average_rental,
          item.price,
          item.description,
          item.size
        )}
      </td>
      <td className="px-4 py-3">{`${item.date_created}`}</td>
      {!short && (
        <>
          <td className="px-4 py-3 text-right">
            <a
              href={`https://www.nekretnine.rs${item.link}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Link
            </a>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              onClick={onCalc}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Calc
            </button>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              onClick={() => console.log("click")}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Edit
            </button>
          </td>
        </>
      )}
    </tr>
  );
};

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
];

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translate = new Translator("dashboard");

  return [
    { title: translate.getTranslation(lang, "searchMetaTitle") },
    {
      name: "description",
      content: translate.getTranslation(lang, "searchMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const size = new URL(request.url).searchParams.get("size") || "65";
  const rentalRatio =
    new URL(request.url).searchParams.get("rental_ratio") || "0.005";

  let isError = false;
  let finalError: FinalError | null = null;

  try {
    const { supabaseClient } = createSupabaseServerClient(request);
    const { data: opportunityData, error: opportunityError } =
      await supabaseClient.rpc("get_opportunity_list", {
        _size: Number(size),
        _rental_ratio: Number(rentalRatio),
      });

    if (opportunityError) {
      isError = true;
      finalError = opportunityError as FinalError;
    }

    return json({
      list: opportunityData,
      mobile: isMobile(userAgent!),
    });
  } catch (error) {
    isError = true;
    finalError = error as FinalError;
  }
  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return json({
    list: [],
    mobile: isMobile(userAgent!),
  });
};

const DashboardOpportunity = () => {
  const [newRent, setNewRent] = useState<number | undefined>();
  const [isRenovation, setIsRenovation] = useState<boolean | undefined>();
  const [discount, setDiscount] = useState<number>(0);
  const [calculation, setCalculation] = useState<boolean>(false);
  const [calculatedAd, setCalculatedAd] = useState<
    OpportunityListItem | undefined
  >();
  const { list } = useLoaderData<{
    list: OpportunityListItem[];
  }>();

  const recalculateAd = (): OpportunityListItem | undefined => {
    if (!calculatedAd?.id) return undefined;
    if (newRent && calculatedAd?.id) {
      return {
        ...calculatedAd,
        price: ((100 - discount) / 100) * calculatedAd.price,
        average_rental: Number(newRent),
        rent_ratio: Number(newRent) / (calculatedAd?.price || 1),
        description: isRenovation
          ? `${calculatedAd.description} za renoviranje.`
          : calculatedAd.description.replace("za renoviranje", ""),
      };
    }

    return { ...calculatedAd };
  };

  return (
    <DashboardPage>
      <div className="grid grid-cols-1 gap-4 pt-5 lg:pt-0">
        <div className="w-full mt-6">
          <h1 className="text-2xl text-center font-bold">
            List of opportunities
          </h1>
        </div>

        <div className="w-full static">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8">
            <Modal open={calculation} width="large">
              <div className="w-full">
                <div>
                  <h3 className="text-center text-22 mb-4">{`The new recalculation model for id: ${calculatedAd?.id}`}</h3>
                </div>
                <div className="w-full grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="new_rent"
                      className="text-sm text-gray-500 ml-2"
                    >
                      New rent
                    </label>
                    <input
                      name="new_rent"
                      type="text"
                      required
                      className="w-full text-sm border-[1px] border-gray-300 focus:border-blue-600 rounded-md px-2 py-3 outline-none"
                      placeholder="New rent"
                      value={newRent}
                      onChange={(event) =>
                        setNewRent(Number(event.target.value))
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="discount"
                      className="text-sm text-gray-500 ml-2"
                    >
                      Discount %
                    </label>
                    <input
                      name="discount"
                      type="text"
                      required
                      className="w-full text-sm border-[1px] border-gray-300 focus:border-blue-600 rounded-md px-2 py-3 outline-none"
                      placeholder="New rent"
                      value={discount}
                      onChange={(event) =>
                        setDiscount(Number(event.target.value))
                      }
                    />
                  </div>
                  <div className="pt-3">
                    <ToggleButton
                      fullWidth
                      value={`${isRenovation || false}`}
                      onChange={(value: string) =>
                        setIsRenovation(Boolean(value))
                      }
                      options={[
                        {
                          text: "Needs renovation",
                          value: "true",
                        },
                        {
                          text: "Renovated",
                          value: "false",
                        },
                      ]}
                    />
                  </div>
                  <div className="pt-8 text-center">
                    <button
                      className="text-md px-5 py-1 bg-blue-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-blue-700 focus:outline-none"
                      onClick={() => setCalculatedAd(recalculateAd())}
                    >
                      Recalculate
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  <div className="overflow-x-auto shadow-md sm:rounded-lg mb-8">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <TableHeader short={true} />
                      {calculatedAd !== undefined && (
                        <TableRow
                          key={calculatedAd.id}
                          item={calculatedAd}
                          short={true}
                          onCalc={() => console.log("a")}
                        />
                      )}
                    </table>
                  </div>
                </div>
                <div className="flex flex-row-reverse mt-6">
                  <button
                    onClick={() => {
                      setCalculation(false);
                      setCalculatedAd(undefined);
                      setDiscount(0);
                      setNewRent(undefined);
                      setIsRenovation(false);
                    }}
                    className="text-md px-6 py-2 bg-gray-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-gray-700 focus:outline-none "
                  >
                    Close
                  </button>
                </div>
              </div>
            </Modal>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <TableHeader />
              <tbody>
                {list.map((item) => (
                  <TableRow
                    key={item.id}
                    item={item}
                    onCalc={() => {
                      setCalculation(true);
                      setCalculatedAd(
                        list.find((listing) => listing.id === item.id)
                      );
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
};

export default DashboardOpportunity;
