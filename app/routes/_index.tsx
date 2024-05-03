import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { TColumn, TLine, TPage } from "../components/layout";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { default as ErrorPage } from "../components/error";
import { isMobile } from "../utils/params";
import IndexCard from "../components/card/IndexCard";
import { Translator } from "../data/language/translator";

export const meta: MetaFunction = () => {
  return [
    { title: "Realvest" },
    { name: "description", content: "Welcome to Realvest" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  return json({ ok: true, mobile: isMobile(userAgent!) });
};

export default function Index() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "sr";
  const translator = new Translator("homepage");

  const {
    mobile,
  }: {
    mobile: boolean;
  } = useLoaderData();

  return (
    <>
      <TPage mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="text-[#333] p-6 mb-6">
              <div className="text-center max-w-4xl max-md:max-w-md mx-auto">
                <div>
                  <p className="text-sm font-bold text-indigo-500 mb-4">
                    <span className="rotate-90 inline-block mr-2">|</span>
                    {translator.getTranslation(lang, "pageTop")}
                  </p>
                  <h2 className="md:text-4xl text-3xl font-extrabold mb-1 md:!leading-[44px]">
                    {translator.getTranslation(lang, "pageTitle")}
                  </h2>
                  <p className="mt-3 text-base text-gray-500 leading-relaxed">
                    {translator.getTranslation(lang, "pageSubtitle")}
                  </p>
                  <div className="flex lg:flex-row flex-col w-full justify-center mt-8">
                    <input
                      type="email"
                      placeholder={translator.getTranslation(
                        lang,
                        "emailPlaceholder"
                      )}
                      className="w-full sm:w-96 bg-gray-50 py-3.5 px-4 text-[#333] text-base focus:outline-none rounded"
                    />
                    <button className="max-sm:mt-8 sm:ml-4 bg-indigo-900 hover:bg-indigo-800 text-white text-base font-semibold py-3.5 px-6 rounded hover:shadow-md hover:transition-transform transition-transform hover:scale-105 focus:outline-none">
                      {translator.getTranslation(lang, "ctaText")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TColumn>
        </TLine>
        <TLine columns={mobile ? 1 : 3} gap={4}>
          <TColumn span={1} start={1}>
            <div className="flex flex-col items-center mb-14">
              <IndexCard
                title={translator.getTranslation(lang, "investmentTitle")}
                text={translator.getTranslation(lang, "investmentExplain")}
                replaceText={translator.getTranslation(lang, "soon")}
              />
            </div>
          </TColumn>
          <TColumn span={1} start={mobile ? 1 : 2}>
            <div className="flex flex-col items-center mb-14">
              <IndexCard
                title={translator.getTranslation(lang, "negotiateTitle")}
                text={translator.getTranslation(lang, "negotiateExplain")}
                replaceText={translator.getTranslation(lang, "soon")}
              />
            </div>
          </TColumn>

          <TColumn span={1} start={mobile ? 1 : 3}>
            <div className="flex flex-col items-center mb-14">
              <IndexCard
                title={translator.getTranslation(lang, "pricingTitle")}
                text={translator.getTranslation(lang, "pricingExplain")}
                replaceText={translator.getTranslation(lang, "soon")}
              />
            </div>
          </TColumn>
        </TLine>
        <TLine columns={mobile ? 1 : 3} gap={4}>
          <TColumn span={1} start={mobile ? 1 : 2}>
            <div className="flex flex-col items-center mb-10">
              <IndexCard
                title={translator.getTranslation(lang, "reportTitle")}
                text={translator.getTranslation(lang, "reportExplain")}
                link={`/dashboard/?lang=${lang}`}
                image="/dashboard2.jpg"
                buttonText={translator.getTranslation(lang, "reportButton")}
                replaceText={translator.getTranslation(lang, "soon")}
              />
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage color="bg-indigo-950" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="bg-indigo-950 py-16 px-6 font-[sans-serif]">
              <div className="max-w-5xl mx-auto text-center text-white">
                <h2 className="text-4xl font-extrabold mb-4">
                  {translator.getTranslation(lang, "bottomTitle")}
                </h2>
                <p className="text-base text-gray-400">
                  {translator.getTranslation(lang, "bottomSubtitle")}
                </p>
                <div className="flex lg:flex-row flex-col w-full justify-center mt-8">
                  <input
                    type="email"
                    placeholder={translator.getTranslation(
                      lang,
                      "emailPlaceholder"
                    )}
                    className="w-full sm:w-96 bg-gray-50 py-3.5 px-4 text-[#333] text-base focus:outline-none rounded"
                  />
                  <button className="max-sm:mt-8 sm:ml-4 bg-indigo-200 hover:bg-indigo-300 text-indigo-900 text-base font-semibold py-3.5 px-6 rounded hover:shadow-md hover:transition-transform transition-transform hover:scale-105 focus:outline-none">
                    {translator.getTranslation(lang, "ctaText")}
                  </button>
                </div>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorPage link={"/"} />;
}
