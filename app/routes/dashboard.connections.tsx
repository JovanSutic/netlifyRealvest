/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { DashboardPage, WidgetWrapper } from "../components/layout";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { createSupabaseServerClient } from "../supabase.server";
import Select from "../components/select/Select";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/dashboard";
import {
  polygon,
  booleanPointInPolygon,
  point,
  lineString,
  pointToLineDistance,
  bbox,
  bboxPolygon,
  transformScale,
} from "@turf/turf";
import {
  ConnectionDetails,
  ListedAd,
  MapItem,
  PropertyType,
  RentalPropertyType,
} from "../types/dashboard.types";
import { ZodError } from "zod";
import { connectionSchema } from "../data/schema/validators";

const currentPropType: RentalPropertyType | PropertyType = "rental";
const transformation: number = 1; 

const getRentalBaseTable = (
  rentalType: RentalPropertyType | PropertyType
): string => {
  if (rentalType === "commercial_rental") return "commercials_rentals";
  if (rentalType === "garage_rental") return "garages_rentals";
  if (rentalType === "rental") return "rentals";
  if (rentalType === "parking") return "garages";
  if (rentalType === "commercial") return "commercials";

  return "apartments";
};

const prepareCityPart = (cityPart: string): string => {
  if (cityPart === "") return "";
  const result = cityPart.split("(")[0].replace(/\s/g, "_").toLowerCase();

  return result.slice(-1) === "_"
    ? result.substring(0, result.length - 1)
    : result;
};

const getCoordinatesOfType = (mapLocation: MapItem[], type: "LineString" | "Polygon" ) => {
  const coordinates: number[][] = [];

  mapLocation.forEach((item) => {
    if (item.geojson.type === type) {
      item.geojson.coordinates.forEach((map) => coordinates.push(map));
    }
  });

  return coordinates;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const part = new URL(request.url).searchParams.get("part");
  const propType = new URL(request.url).searchParams.get("type");
  const location = new URL(request.url).searchParams.get("location");
  const search = new URL(request.url).searchParams.get("search");
  
  if(process.env.BASE_URL !== "http://localhost:5173") {
    throw Error("Forbidden");
    return null;
  }

  try {
    let archiveItems: ListedAd[] = [];
    let detailItems: ConnectionDetails[] = [];
    let locationItems: MapItem | undefined = undefined;
    const { supabaseClient } = createSupabaseServerClient(request);

    const { data: partsData, error: partsError } = await supabaseClient.rpc(
      "get_distinct_city_part"
    );

    if (partsError) {
      throw new Response("Last date error.", {
        status: 500,
      });
    }

    if (part && !location) {
      const cityPart: string = partsData[part];
      const { data: archiveData, error: archiveError } = await supabaseClient
        .from("apartments_archive")
        .select()
        .eq("city_part", cityPart)
        .eq("is_active", false)
        .eq("type", currentPropType)
        .is("link_id", null)
        .order("id");
      if (archiveError) {
        throw new Response("Archive error.", {
          status: 500,
        });
      }

      archiveItems = archiveData;

      const detailLocation = await fetchData(
        `https://nominatim.openstreetmap.org/search.php?q=${prepareCityPart(
          cityPart
        )}_beograd&format=jsonv2&polygon_geojson=1`
      );

      if ((detailLocation || []).length) {
        const coordinatesBase = detailLocation.find(
          (item: MapItem) => item?.geojson?.type === "Polygon"
        );

        if (coordinatesBase) {
          const poly = (coordinatesBase.geojson?.coordinates || []).length
            ? polygon(coordinatesBase.geojson?.coordinates)
            : null;

          if (poly) {
            const { data: usedIds, error: usedError } = await supabaseClient
              .from("apartments_archive")
              .select("link_id")
              .eq("type", currentPropType)
              .not("link_id", "is", null);

            if (usedError) {
              throw new Response("Used ids error.", {
                status: 500,
              });
            }
            const ids = usedIds.map((item) => item.link_id);

            const { data: detailsData, error: detailsError } =
              await supabaseClient
                .from("ad_details")
                .select("id, description, type, lat, lng")
                .eq("type", propType)
                .not("id", "in", `(${ids.toString()})`);

            if (detailsError) {
              throw new Response("Details error.", {
                status: 500,
              });
            }

            detailItems = detailsData.filter((item) => {
              const detailPoint = point([Number(item.lng), Number(item.lat)]);
              if (booleanPointInPolygon(detailPoint, poly)) {
                return item;
              }
            });
          }
        }
      }
    }

    console.log(location);

    if (location) {
      const hintLocation: MapItem[] = await fetchData(
        `https://nominatim.openstreetmap.org/search.php?q=${location}_beograd&format=jsonv2&polygon_geojson=1`
      );
      const coordinates: number[][] = getCoordinatesOfType(hintLocation, "Polygon");

      locationItems = (hintLocation || []).find(
        (item) => item.geojson.type === "Polygon"
      );

      if (locationItems) {
        locationItems.geojson.coordinates = coordinates;
      }

      // // @ts-ignore
      // archiveItems = [null];
      // // @ts-ignore
      // detailItems = [null];

      if (search === "1" && locationItems) {
        console.log(locationItems)
        const line = polygon(coordinates as any);
        const trans = transformScale(line, transformation);
        const box = bbox(trans);
        const bboxPolygon1 = bboxPolygon(box);
        const uniq = [
          ...new Set(bboxPolygon1.geometry.coordinates[0].flat()),
        ].sort(function (a, b) {
          return b - a;
        });

        const rentalBaseTable = getRentalBaseTable(currentPropType);

        const { data: currentData, error: currentError } = await supabaseClient
          .from(rentalBaseTable)
          .select("id")
          .order("id");

        if (currentError) {
          throw new Response("Current error.", {
            status: 500,
          });
        }

        const currentAdIds = currentData.map((item) => item.id);

        const { data: searchData, error: searchError } = await supabaseClient
          .from("ad_details")
          .select("id, description, type, lat, lng")
          .eq("type", currentPropType)
          .gt("lat", uniq[1])
          .lt("lat", uniq[0])
          .gt("lng", uniq[3])
          .lt("lng", uniq[2]);

          console.log(searchData?.length)
        if (searchError) {
          console.log(searchError);
          throw new Response("Search error.", {
            status: 500,
          });
        }

        const searchResultData = searchData.filter(
          (item) => !currentAdIds.includes(item.id)
        );

        if (searchResultData.length) {
          detailItems = searchResultData;
        }

        // const { data: archiveSearchData, error: archiveSearchError } =
        //   await supabaseClient
        //     .from("apartments_archive")
        //     .select()
        //     .eq("type", currentPropType)
        //     .eq("is_active", false)
        //     .is("link_id", null)
        //     .ilike("name", `%${location}%`)
        //     .order("id");

        // if (archiveSearchError) {
        //   throw new Response("Search archive error.", {
        //     status: 500,
        //   });
        // }

        // if (archiveSearchData.length) {
        //   archiveItems = archiveSearchData;
        // }
      }
    }
    return json({
      partsData,
      archiveItems,
      detailItems,
      locationItems,
    });
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const archiveId = formData.get("archiveId");
  const detailId = formData.get("detailId");

  try {
    const { success, error: zError } = connectionSchema.safeParse({
      archiveId,
      detailId,
    });

    const { supabaseClient, headers } = createSupabaseServerClient(request);

    if (success) {
      const { error } = await supabaseClient
        .from("apartments_archive")
        .update({ link_id: detailId })
        .eq("id", archiveId);

      if (error) {
        return json({ success: false, error: error }, { headers, status: 400 });
      } else {
        return json({ success: true }, { headers, status: 200 });
      }
    } else {
      return json({ success: false, error: zError }, { headers, status: 400 });
    }
  } catch (error) {
    return error as ZodError;
  }

  return null;
};

const DashboardInsights = () => {
  const [archiveId, setArchiveId] = useState<string>("");
  const [detailId, setDetailId] = useState<string>("");
  const [cityPart, setCityPart] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [archive, setArchive] = useState<ListedAd[]>([]);
  const [details, setDetails] = useState<ConnectionDetails[]>([]);
  const [matches, setMatches] = useState<ConnectionDetails[]>([]);
  const [search, setSearch] = useState<boolean>(false);
  const loaderData = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const fetcher = useFetcher<typeof loader>({
    key: "get_connections",
  });

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    fetcher.load(
      `/dashboard/connections?part=${cityPart}&type=${currentPropType}`
    );
  }, [cityPart]);

  useEffect(() => {
    if (search) {
      fetcher.load(`/dashboard/connections?location=${location}&search=1`);
    }
  }, [search]);

  useEffect(() => {
    if (fetcher.data?.locationItems) {
      const match = details.filter((item) => {
        const detailPoint = point([Number(item.lng), Number(item.lat)]);
        const area = fetcher.data?.locationItems
          ? polygon(fetcher.data.locationItems.geojson.coordinates as any)
          : null;
        if (booleanPointInPolygon(detailPoint, area!)) {
          return item;
        }
        
      });
      console.log(match.length)
      setMatches(
        match.sort(function (a, b) {
          return a.id! - b.id!;
        })
      );
    }
  }, [fetcher.data?.locationItems, details.length]);

  useEffect(() => {
    if (
      fetcher.data?.archiveItems.length === 1 &&
      fetcher.data?.archiveItems[0] === null
    ) {
      console.log("location call");
    } else {
      if (fetcher.data?.archiveItems && fetcher.data?.archiveItems.length) {
        setArchive(fetcher.data?.archiveItems.sort(function (a, b) {
          return b.size - a.size;
        }) as unknown as ListedAd[]);
      }
    }
  }, [fetcher.data?.archiveItems]);

  useEffect(() => {
    if (
      fetcher.data?.detailItems.length === 1 &&
      fetcher.data?.detailItems[0] === null
    ) {
      console.log("location call");
    } else {
      setDetails(fetcher.data?.detailItems || []);
      if (search) {
        setSearch(false);
      }
    }
  }, [fetcher.data?.detailItems]);

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      setArchiveId("");
      setDetailId("");
    }
  }, [actionData]);

  return (
    <DashboardPage>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="col-span-2 row-start-1">
          <WidgetWrapper>
            <p className="text-2xl">Archive connections</p>
          </WidgetWrapper>
        </div>
        <div className="col-start-1 row-start-2">
          <WidgetWrapper>
            <div className="pt-2 mb-5">
              <div className="relative flex items-center">
                <input
                  name="location"
                  type="text"
                  className="w-full text-sm border border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                  placeholder="Location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#bbb"
                  stroke="#bbb"
                  className="w-4 h-4 absolute right-4"
                  viewBox="0 0 24 24"
                >
                  <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                  <path
                    d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                    data-original="#000000"
                  ></path>
                </svg>
              </div>
            </div>
            <div>
              <Select
                name="cityPart"
                value={cityPart}
                isFullWidth={true}
                setValue={(value) => {
                  setLocation("");
                  setArchive([]);
                  setDetails([]);
                  setMatches([]);
                  setCityPart(value);
                }}
                options={loaderData?.partsData.map(
                  (item: string, index: number) => ({
                    value: index,
                    text: item,
                  })
                )}
              />
            </div>

            <div className="mt-4">
              <button
                type="button"
                disabled={location.length < 3 || cityPart === ""}
                className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white disabled:bg-gray-300 bg-blue-700 hover:bg-blue-800 focus:outline-none"
                onClick={() => {
                  fetcher.load(`/dashboard/connections?location=${location}`);
                }}
              >
                Compare
              </button>
            </div>

            <div className="mt-4">
              <button
                type="button"
                disabled={location.length < 3 || cityPart === ""}
                className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white disabled:bg-gray-300 bg-blue-700 hover:bg-blue-800 focus:outline-none"
                onClick={() => {
                  setSearch(true);
                }}
              >
                Search
              </button>
            </div>
          </WidgetWrapper>
        </div>
        <div className="col-start-2 row-start-2">
          <WidgetWrapper>
            <Form method="post">
              <div className="pt-2 mb-5">
                <div className="relative flex items-center">
                  <input
                    name="archiveId"
                    type="text"
                    required
                    className="w-full text-sm border border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    placeholder="Archive id"
                    value={archiveId}
                    onChange={(event) => setArchiveId(event.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="relative flex items-center">
                  <input
                    name="detailId"
                    type="text"
                    required
                    className="w-full text-sm border border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    placeholder="Detail id"
                    value={detailId}
                    onChange={(event) => setDetailId(event.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={
                    navigation.state === "submitting" || !archiveId || !detailId
                  }
                  className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white disabled:bg-gray-300 bg-blue-700 hover:bg-blue-800 focus:outline-none"
                >
                  {"Connect"}
                  {navigation.state === "submitting" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      fill="#fff"
                      className="ml-2 inline animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
                        data-original="#000000"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </Form>
          </WidgetWrapper>
        </div>
        <div className="row-start-3">
          <WidgetWrapper>
            <p className="text-1xl center">Archive list</p>
            <div className="font-sans overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      SIZE
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                  {archive.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {item.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {item.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {item.price}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {item.size}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WidgetWrapper>
        </div>
        <div className="row-start-3">
          <WidgetWrapper>
            <p className="text-1xl center">Details list</p>
            <div className="font-sans overflow-auto max-h-96">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 whitespace-nowrap">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      DISTANCE
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      DESCRIPTION
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                  {matches.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {item.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {item.distance}
                      </td>
                      <td
                        className="px-4 py-4 text-sm text-gray-800"
                        title={item.description}
                      >
                        {item.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WidgetWrapper>
        </div>
      </div>
    </DashboardPage>
  );
};

export default DashboardInsights;
