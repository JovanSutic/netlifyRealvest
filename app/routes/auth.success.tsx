import { Link, useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";

export default function RegisterSuccess() {
  const [searchParams] = useSearchParams();
  
  const translator = new Translator("auth");
  const lang = searchParams.get("lang");
  return (
    <div className="w-full flex justify-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen">
      <div className="lg:w-1/3 md:w-1/2 sm:w-3/4 w-full">
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
        <div className=" bg-white rounded-2xl p-6 mt-4 relative z-10 shadow-lg">
          <div className="mb-10">
            <h3 className="text-3xl text-center font-extrabold text-slate-800 mb-3">
              {translator.getTranslation(lang!, "success")}
            </h3>
            <h3 className="text-sm text-center text-slate-400">
              {translator.getTranslation(lang!, "successText")}
            </h3>
          </div>

          <div className="mt-4">
            <p className="text-sm text-center mt-6">
              {translator.getTranslation(lang!, "alreadyConfirm")}
              <Link
                to={`/auth/?lang=${lang}`}
                className="text-blue-500 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                {translator.getTranslation(lang!, "signTitle")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
