import { json, LoaderFunctionArgs } from "@remix-run/node";
import { MetaFunction, Link, useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { getParamValue, isMobile } from "../utils/params";

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translator = new Translator("homepage");
  return [
    { title: translator.getTranslation(lang, "homeMetaTitle") },
    {
      name: "description",
      content: translator.getTranslation(lang, "homeMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  return json({ ok: true, mobile: isMobile(userAgent!) });
};

const Terms = () => {
  const [searchParams] = useSearchParams();

  const translator = new Translator("terms");
  const lang = searchParams.get("lang") || "sr";
  return (
    <div className="w-full bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen">
      <div className="w-[320px] md:w-[500px] xl:w-[760px] mx-auto ">
        <div className="flex w-full">
          <div className="w-full">
            <div className="w-[140px] mx-auto">
              <Link to={`/?lang=${lang}`}>
                <img
                  src="/logo2.png"
                  alt="Realvest logo"
                  className="max-w-full"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center my-10">
          <h2 className="text-3xl font-bold">
            {translator.getTranslation(lang, "title")}
          </h2>
        </div>
        {[...Array(22).keys()].map((item) => (
          <div key={item} className="flex w-full flex-col items-center my-6">
            <h6 className="text-xl font-bold">
              {translator.getTranslation(lang, `sub${item + 1}`)}
            </h6>
            <p className="text-md font-regular mt-3">
              {translator.getTranslation(lang, `text${item + 1}`)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;
