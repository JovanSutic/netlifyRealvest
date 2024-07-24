import { LoaderFunctionArgs, json } from "@remix-run/node";
import { DashboardPage } from "../components/layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
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
  return (
    <DashboardPage>
      <p className="text-2xl">This is Dashboard Insights</p>
    </DashboardPage>
  );
};

export default DashboardInsights;
