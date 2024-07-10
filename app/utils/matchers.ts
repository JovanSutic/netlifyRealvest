import { createSupabaseServerClient } from "../supabase.server";
import { ListedAd } from "../types/dashboard.types";

interface ShortDetail {
  id: string;
  description: string;
}

type SearchBasis = "m2" | "id";

const getAdExternalId = (num: number, text: string): string => {
  const index = text.indexOf("ID");
  if (index > 0) {
    const key = text.substring(index + 3, index + num).replace(/\D+/g, "");
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

export const getArchiveDuplicateIds = async (request: Request) => {
  try {
    const { supabaseClient } = createSupabaseServerClient(request);
    const { data: archiveData, error: archiveError } = await supabaseClient
      .from("apartments_archive")
      .select()
      .eq("type", "rental")
      .neq("name", "")
      .is("link_id", null)
      .order("id");

    if (archiveError) {
      throw new Response("Archive error.", {
        status: 500,
      });
    }

    const matchesMap: Record<string, ListedAd[]> = {};

    archiveData.forEach((item) => {
      if (matchesMap[`${item.city_part}-${item.size}-${item.price}`]) {
        matchesMap[`${item.city_part}-${item.size}-${item.price}`].push(item);
      } else {
        matchesMap[`${item.city_part}-${item.size}-${item.price}`] = [item];
      }
    });

    const matches: Record<string, ListedAd[]> = {};

    Object.keys(matchesMap).forEach((key) => {
      if (matchesMap[key].length > 1) {
        matches[key] = matchesMap[key];
      }
    });

    const ids: number[] = [];

    Object.keys(matches).forEach((key) => {
      matches[key].forEach((item, index) => {
        if (index < matches[key].length - 1) {
          ids.push(item.id!);
        }
      });
    });

    return ids;
  } catch (error) {
    console.log(error);
  }

  return [];
};

export const getArchiveMatches = async (
  request: Request,
  searchBasis: SearchBasis
) => {
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
          if (key.length > 4 && item.description.includes(key)) {
            sizeMap[key].details.push(item);
          }
        });
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

    return matches;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const getArchiveMatches2 = async (request: Request) => {
  try {
    const { supabaseClient } = createSupabaseServerClient(request);
    const { data: archiveData, error: archiveError } = await supabaseClient
      .from("apartments_archive")
      .select()
      .eq("type", "rental")
      .neq("name", "")
      .textSearch("name", "m2")
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
      .not("id", "in", `(${ids.toString()})`)
      .textSearch("description", "m2");

    if (detailsError) {
      throw new Response("Details error.", {
        status: 500,
      });
    }

    const sizeMap: Record<
      string,
      { archive: ListedAd[]; details: ShortDetail[] }
    > = {};

    console.log(archiveData.length);
    console.log(detailsData.length);

    archiveData.forEach((item) => {
      const m2index = getIndicesOf("m2", item.name)[0];
      const numeral = item.name
        .substring(m2index - 10, m2index)
        .split(".")[0]
        .replace(/\D/g, "");

      if (numeral) {
        if (sizeMap[numeral]) {
          sizeMap[numeral].archive.push(item);
        } else {
          sizeMap[numeral] = { archive: [item], details: [] };
        }
      }
    });

    detailsData.forEach((item) => {
      const m2index = getIndicesOf("m2", item.description);
      const numMatches = m2index.map((num) =>
        item.description
          .substring(num - 6, num)
          .split(".")[0]
          .replace(/\D/g, "")
      );

      numMatches.forEach((match) => {
        if (sizeMap[match]) {
          sizeMap[match].details.push(item);
        }
      });
    });

    return sizeMap;
  } catch (error) {
    console.log(error);
  }

  return null;
};
