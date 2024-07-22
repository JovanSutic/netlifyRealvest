import { LoaderFunctionArgs, json } from "@remix-run/node";
import { DashboardPage } from "../components/layout";
import { useLoaderData } from "@remix-run/react";
// import { getArchiveMatches2 } from "../utils/matchers";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // const matches = await getArchiveMatches2(request);
    console.log(request);

    return json({
      matches: [],
    });
  } catch (error) {
    console.log(error);
  }

  return null;
};

const DashboardInsights = () => {
  const data = useLoaderData<typeof loader>();
  console.log(data?.matches);
  return (
    <DashboardPage>
      <p className="text-2xl">This is Dashboard Insights</p>
    </DashboardPage>
  );
};

export default DashboardInsights;
