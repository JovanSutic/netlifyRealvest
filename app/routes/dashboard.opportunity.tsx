import { DashboardPage } from "../components/layout";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction, useFetcher, useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import { getParamValue, isMobile } from "../utils/params";
import { getLocationRentalPrice, sortOpportunity } from "../utils/opportunity";
import { Translator } from "../data/language/translator";
import { FinalError } from "../types/component.types";
import { useEffect, useState } from "react";
import {
  ListedAd,
  OpportunityListItem,
  RentalAverage,
} from "../types/dashboard.types";
import { TableHeader, TableRow } from "../components/table/OpportunityTable";
import CalcOpportunityModal from "../widgets/CalcOpportunityModal";
import Select from "../components/select/Select";

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
  const calculationId = new URL(request.url).searchParams.get("calculationId");
  const rentalRatio =
    new URL(request.url).searchParams.get("rental_ratio") || "0.005";

  let isError = false;
  let finalError: FinalError | null = null;

  let rentalAverage = null;

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

    if (calculationId) {
      const { data: calcItemData, error: calcItemError } = await supabaseClient
        .from("apartments")
        .select("*")
        .eq("id", calculationId);

      if (calcItemError) {
        isError = true;
        finalError = calcItemError as FinalError;
      }

      const { data: rentalsData, error: rentalsError } = await supabaseClient
        .from("rentals")
        .select("*")
        .eq("city_part", calcItemData?.[0].city_part || "");

      if (rentalsError) {
        isError = true;
        finalError = rentalsError as FinalError;
      }

      rentalAverage = getLocationRentalPrice(
        rentalsData as ListedAd[],
        calcItemData?.[0].size
      );
    }

    return json({
      list: opportunityData,
      mobile: isMobile(userAgent!),
      rentalAverage,
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
    rentalAverage,
  });
};

const DashboardOpportunity = () => {
  const [opportunityList, setOpportunityList] = useState<OpportunityListItem[]>(
    []
  );
  const [sort, setSort] = useState<string>("date_created|desc");
  const [calculation, setCalculation] = useState<boolean>(false);
  const [calculatedAd, setCalculatedAd] = useState<
    OpportunityListItem | undefined
  >();
  const { list } = useLoaderData<{
    list: OpportunityListItem[];
    rentalAverage: RentalAverage;
  }>();

  const fetcher = useFetcher<{
    list: OpportunityListItem[];
    rentalAverage: RentalAverage;
  }>({
    key: "get_opportunities",
  });

  useEffect(() => {
    const split = sort.split("|");
    const newList = sortOpportunity(
      list,
      split[0] as keyof OpportunityListItem,
      split[1] === "desc"
    );
    setOpportunityList(newList);
  }, [sort]);

  return (
    <DashboardPage>
      <div className="grid grid-cols-1 gap-4 pt-5 lg:pt-0">
        <div className="w-full mt-6">
          <h1 className="text-2xl text-center font-bold">
            List of opportunities
          </h1>
          <div className="w-full">
            <div className="w-[250px]">
              <Select
                name="opportunitySort"
                isFullWidth
                value={sort}
                setValue={(value) => setSort(value)}
                options={[
                  {
                    value: "date_created|desc",
                    text: "Date DESC",
                  },
                  {
                    value: "date_created|asc",
                    text: "Date ASC",
                  },
                  {
                    value: "rent_ratio|desc",
                    text: "ROI DESC",
                  },
                  {
                    value: "rent_ratio|asc",
                    text: "ROI ASC",
                  },
                  {
                    value: "price|desc",
                    text: "Rent DESC",
                  },
                  {
                    value: "price|asc",
                    text: "Rent ASC",
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="w-full static">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-8">
            <CalcOpportunityModal
              isOpen={calculation}
              listItem={calculatedAd}
              onClose={() => setCalculation(false)}
              rentalAverage={fetcher.data?.rentalAverage || null}
              onAdditional={() =>
                fetcher.load(
                  `/dashboard/opportunity/?calculationId=${calculatedAd?.id}`
                )
              }
            />
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <TableHeader />
              <tbody>
                {opportunityList.map((item) => (
                  <TableRow
                    key={item.id}
                    item={item}
                    onCalc={() => {
                      setCalculation(true);
                      setCalculatedAd(
                        opportunityList.find(
                          (listing) => listing.id === item.id
                        )
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
