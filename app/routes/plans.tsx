import { json, LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { getParamValue, isMobile } from "../utils/params";
import PricingPlan from "../widgets/PricingPlan";
import { LangType } from "../types/dashboard.types";
import { PlanType } from "../types/component.types";
import Modal from "../components/modal";
import { useEffect, useState } from "react";

const getOptions = (
  list: string[],
  limit: number
): { name: string; active: boolean }[] =>
  list.map((item, index) => {
    if (index < limit) {
      return { name: item, active: true };
    } else {
      return { name: item, active: false };
    }
  });

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translate = new Translator("homepage");
  return [
    { title: translate.getTranslation(lang, "homeMetaTitle") },
    {
      name: "description",
      content: translate.getTranslation(lang, "homeMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  return json({ ok: true, mobile: isMobile(userAgent!) });
};

const Plans = () => {
  const [modal, setModal] = useState<boolean>(false);
  const [plan, setPlan] = useState<string>("");
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "sr";
  const translate = new Translator("components");

  const options = translate.getTranslation(lang!, "planFeatureList").split(",");

  const planOptions: PlanType[] = [
    {
      name: translate.getTranslation(lang!, "planBasicTitle"),
      description: translate.getTranslation(lang!, "planBasicText"),
      priceYear: "0 €",
      priceMonth: "0 €",
      isActive: false,
      link: `/auth/register?lang=${lang}`,
      options: getOptions(options, 2),
    },
    {
      name: translate.getTranslation(lang!, "planPremiumTitle"),
      description: translate.getTranslation(lang!, "planPremiumText"),
      isActive: true,
      priceYear: "180 €",
      priceMonth: "25 €",
      link: "",
      options: getOptions(options, 6),
    },
    {
      name: translate.getTranslation(lang!, "planAgencyTitle"),
      description: translate.getTranslation(lang!, "planAgencyText"),
      isActive: false,
      priceYear: translate.getTranslation(lang!, "planCustom"),
      priceMonth: translate.getTranslation(lang!, "planCustom"),
      link: "",
      options: getOptions(options, 8),
    },
  ];

  useEffect(() => {
    if(plan) {
      setModal(true);
    } else {
      setModal(false);
    }
  }, [plan]);

  return (
    <div className="w-full bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen">
      <PricingPlan
        lang={lang as LangType}
        options={planOptions}
        toggle={setPlan}
      />
      <Modal open={modal}>
        <>
          <h3 className="text-center text-2xl font-bold mb-2">
            {translate.getTranslation(lang, "planModalTitle")}
          </h3>
          <hr />
          <p className="text-left mt-4 text-md">
            {translate.getTranslation(lang, "planModalText1")}
          </p>
          <p className="text-left mt-2 text-md">
            {`${translate.getTranslation(lang, "planModalText2")} `}
            <strong>{translate.getTranslation(lang, "email")}</strong>
            {` ${translate.getTranslation(lang, "planModalText3")}`}
            <strong>{`${translate.getTranslation(lang, `planModalText${plan}`)}`}</strong>
            {translate.getTranslation(lang, "planModalText5")}
          </p>
          <div className="flex flex-row-reverse mt-6">
            <button
              onClick={() => {
                setPlan("");
              }}
              className="text-md px-6 py-2 bg-gray-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-gray-700 focus:outline-none "
            >
              {translate.getTranslation(lang, "close")}
            </button>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default Plans;
