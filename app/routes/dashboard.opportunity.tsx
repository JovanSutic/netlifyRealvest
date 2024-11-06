import { DashboardPage } from "../components/layout";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { getParamValue, isMobile } from "../utils/params";
import { Translator } from "../data/language/translator";
import { FinalError } from "../types/component.types";
import { getNumberWithDecimals, isNewFromDesc } from "../utils/market";
import { makeNumberCurrency } from "../utils/numbers";

interface OpportunityListItem {
  id: number;
  name: string;
  link: string;
  date_created: Date;
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

const getFullPrice = (price: number, isNew: boolean): number => {
  const tax = isNew ? calculateExtraTax(price) : calculateAbsoluteTax(price);
  return (
    price + tax + 40 + calculateNotaryFee(price) + calculateAgentFee(price)
  );
};

const getFurnitureCost = (size: number): number => {
  return getNumberWithDecimals(size * 300, 2);
};

const getPurchaseFee = (
  price: number,
  isNew: boolean,
  size: number
): number => {
  return (getFullPrice(price, isNew) + getFurnitureCost(size)) * 0.03;
};

const getM2Price = (price: number, isNew: boolean, size: number): number => {
  const fullPrice = getFullPrice(price, isNew) + getFurnitureCost(size);
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
  return getNumberWithDecimals(getRentNet(rent, size) * 0.1, 2);
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
  isNew: boolean,
  size: number
) => {
  return getNumberWithDecimals(
    (getRentRevenueM2Yearly(rent, size) / getM2Price(price, isNew, size)) * 100,
    2
  );
};

const highlightRoi = (
  rent: number,
  price: number,
  isNew: boolean,
  size: number
): string => {
  const roi = getRentROI(rent, price, isNew, size);

  if (roi > 5) return "bg-green-100";
  if (roi > 4) return "bg-blue-100";
  if (roi > 3) return "bg-amber-100";

  return "bg-white";
};

const highlightPriceM2 = (
  price: number,
  isNew: boolean,
  size: number
): string => {
  const m2Price = getM2Price(price, isNew, size);
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

const DashboardSearch = () => {
  const { list } = useLoaderData<typeof loader>();

  console.log(list);

  return (
    <DashboardPage>
      <div className="grid grid-cols-1 gap-4 pt-5 lg:pt-0">
        <div className="w-full mt-6">
          <h1 className="text-2xl text-center font-bold">
            List of opportunities
          </h1>
        </div>

        <div className="w-full">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                    <span className="sr-only">Link</span>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((item: OpportunityListItem) => (
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
                      {makeNumberCurrency(
                        getFullPrice(
                          item.price,
                          isNewFromDesc(item.description)
                        )
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(getFurnitureCost(item.size))}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(
                        getPurchaseFee(
                          item.price,
                          isNewFromDesc(item.description),
                          item.size
                        )
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 ${highlightPriceM2(
                        item.price,
                        isNewFromDesc(item.description),
                        item.size
                      )}`}
                    >
                      {makeNumberCurrency(
                        getM2Price(
                          item.price,
                          isNewFromDesc(item.description),
                          item.size
                        )
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(item.average_rental)}
                    </td>
                    <td
                      className={`px-4 py-3 ${highlightRentGross(
                        item.average_rental,
                        item.size
                      )}`}
                    >
                      {makeNumberCurrency(
                        getRentGross(item.average_rental, item.size)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(
                        getRentNet(item.average_rental, item.size)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(
                        getRentTax(item.average_rental, item.size)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(
                        getRentFee(item.average_rental, item.size)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(
                        getRentAmortization(item.average_rental, item.size)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(
                        getRentRevenue(item.average_rental, item.size)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {makeNumberCurrency(
                        getRentRevenueM2(item.average_rental, item.size)
                      )}
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
                        isNewFromDesc(item.description),
                        item.size
                      )}`}
                    >
                      {getRentROI(
                        item.average_rental,
                        item.price,
                        isNewFromDesc(item.description),
                        item.size
                      )}
                    </td>
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
                        onClick={() => console.log("click")}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardPage>
  );
};

export default DashboardSearch;
