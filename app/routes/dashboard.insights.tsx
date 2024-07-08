import { LoaderFunctionArgs, json } from "@remix-run/node";
import { DashboardPage } from "../components/layout";
import { createSupabaseServerClient } from "../supabase.server";
import { useLoaderData } from "@remix-run/react";
import { ListedAd } from "../types/dashboard.types";

interface ShortDetail {
  id: string;
  description: string;
}

const searchBasis: "m2" | "id" = "m2";

const getAdExternalId = (num: number, text: string): string => {
  const index = text.indexOf("ID");
  if (index > 0) {
    const key = text.substring(index + 3, index + num).replace(/\D+/g, '');
    return key;
  }
  return "";
};


const includesCityPart = (description: string, city_part: string) => {
  let result = false;
  const split = city_part
    .replace(/\[\d+\]/g, "")
    .replace(/"/g, "")
    .replace(/'/g, "")
    .replace(/\(|\)/g, "")
    .split(" ");
  split.forEach((item) => {
    if (description.includes(item)) {
      result = true;
    }
  });

  return result;
};

const getIndicesOf = (searchStr: string, str: string, caseSensitive = true) => {
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  let startIndex = 0;
  let index = undefined;
  const indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
};

const compareNameToDescription = (name: string[], description: string) => {
  if (name.length < 2) return 0;

  let match = 0;
  name.forEach((item) => {
    if (description.includes(item)) {
      match = match + 1;
    }
  });

  return (match / name.length) * 100;
};

const isNameWithLandmark = (name: string) => {
  let result = false;
  if (name.length < 2) return result;
  const split = name.split(" ");
  (split || []).forEach((item, index) => {
    if (index > 0 && /^\p{Lu}/u.test(item)) {
      result = true;
    }
  });

  return result;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { supabaseClient } = createSupabaseServerClient(request);
    const { data: archiveData, error: archiveError } = await supabaseClient
      .from("apartments_archive")
      .select()
      .eq("type", "rental")
      .neq("name", "")
      .is("link_id", null);

    if (archiveError) {
      throw new Response("Archive error.", {
        status: 500,
      });
    }

    const { data: usedIds, error: usedError } = await supabaseClient
      .from("apartments_archive")
      .select("link_id")
      .eq("type", "rental")
      .not("link_id", "is", null);

    if (usedError) {
      throw new Response("Used ids error.", {
        status: 500,
      });
    }

    const ids = usedIds.map((item) => item.link_id);

    const { data: detailsData, error: detailsError } = await supabaseClient
      .from("ad_details")
      .select("id, description")
      .eq("type", "rental")
      .not("id", "in", `(${ids.toString()})`);

    if (detailsError) {
      throw new Response("Details error.", {
        status: 500,
      });
    }

    const sizeMap: Record<
      string,
      { archive: ListedAd[]; details: ShortDetail[] }
    > = {};

    if (searchBasis === "m2") {
      archiveData
        .filter((item) => isNameWithLandmark(item.name))
        .forEach((item) => {
          if (!sizeMap[item.size]) {
            sizeMap[item.size] = { archive: [item], details: [] };
          } else {
            sizeMap[item.size].archive.push(item);
          }
        });

      detailsData.forEach((item) => {
        const m2index = getIndicesOf("m2", item.description);
        const numMatches = m2index.map((num) =>
          item.description.substring(num - 3, num).replace(/\D/g, "")
        );

        numMatches.forEach((num) => {
          if (sizeMap[num]) {
            sizeMap[num].details.push(item);
          }
        });
      });
    } else {
      archiveData.forEach((item) => {
        const key = getAdExternalId(11, item.name);
        if (!key) return;
        if (!sizeMap[key]) {
          sizeMap[key] = { archive: [item], details: [] };
        } else {
          sizeMap[key].archive.push(item);
        }
      });
  
   detailsData.forEach((item) => {
        Object.keys(sizeMap).forEach((key) => {
          if(key.length > 4 && item.description.includes(key)) {
            sizeMap[key].details.push(item);
          }
        })
      });
  
    }

    const matchesPre: { archive: ListedAd; detail: ShortDetail }[] = [];

    Object.keys(sizeMap).forEach((key) => {
      sizeMap[key].archive.forEach((archiveItem) => {
        const archiveItemName = archiveItem.name.split(" ");

        sizeMap[key].details.forEach((detail) => {
          if (
            (detail.description.includes(`${archiveItem.price}`) ||
              detail.description.includes(`${archiveItem.size}`)) &&
            includesCityPart(detail.description, archiveItem.city_part) &&
            compareNameToDescription(archiveItemName, detail.description) > 70
          ) {
            matchesPre.push({
              archive: archiveItem,
              detail,
            });
          }
        });
      });
    });

    const matchesCheck: Record<string, number> = {};
    const matches: { archive: ListedAd; detail: ShortDetail }[] = [];

    matchesPre.forEach((item) => {
      if (!matchesCheck[`${item.archive.id}-${item.detail.id}`]) {
        matchesCheck[`${item.archive.id}-${item.detail.id}`] = 1;
        matches.push(item);
      }
    });

    return json({
      archiveData,
      detailsData,
      matches,
    });
  } catch (error) {
    console.log(error);
  }

  return null;
};

const DashboardInsights = () => {
  const data = useLoaderData<typeof loader>();
  // console.log(data?.archiveData.length);
  console.log(data?.matches);
  return (
    <DashboardPage>
      <p className="text-2xl">This is Dashboard Insights</p>
    </DashboardPage>
  );
};

export default DashboardInsights;
