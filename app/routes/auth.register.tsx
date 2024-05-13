import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Register to Estate Insights" },
    {
      name: "description",
      content: "Register to Estate Insights to get best property insights",
    },
  ];
};

export default function AuthRegister() {
  const [searchParams] = useSearchParams();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const translator = new Translator("auth");
  const lang = searchParams.get("lang");
  return (
    <div className="w-full flex justify-center items-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4">
      <div className="w-1/4 md:w-1/3 sm:w-full justify-center mx-auto">
        <div className=" bg-white rounded-2xl p-6 -mt-24 relative z-10 shadow-lg">
          <div className="mb-10">
            <h3 className="text-3xl font-extrabold text-slate-800 mb-3">
              {translator.getTranslation(lang!, "registerTitle")}
            </h3>
            <h3 className="text-sm text-slate-400">
              {translator.getTranslation(lang!, "registerDescription")}
            </h3>
          </div>
          <div>
            <Form>
              <div className="mt-8">
                <div className="relative flex items-center">
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    placeholder={translator.getTranslation(lang!, "nameInput")}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-4 h-4 absolute right-4"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="10"
                      cy="7"
                      r="6"
                      data-original="#000000"
                    ></circle>
                    <path
                      d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="mt-8">
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="text"
                    required
                    className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    placeholder={translator.getTranslation(lang!, "emailInput")}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    className="w-[18px] h-[18px] absolute right-2"
                    viewBox="0 0 682.667 682.667"
                  >
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path
                          d="M0 512h512V0H0Z"
                          data-original="#000000"
                        ></path>
                      </clipPath>
                    </defs>
                    <g
                      clipPath="url(#a)"
                      transform="matrix(1.33 0 0 -1.33 0 682.667)"
                    >
                      <path
                        fill="none"
                        strokeMiterlimit="10"
                        strokeWidth="40"
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="mt-8">
                <div className="relative flex items-center">
                  <input
                    name="password"
                    id="hs-toggle-password"
                    type={!showPass ? "password" : "text"}
                    required
                    className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    placeholder={translator.getTranslation(lang!, "passInput")}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute top-0 end-0 p-3.5 rounded-e-md"
                  >
                    {!showPass ? (
                      <svg
                        className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#bbb"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line x1="2" x2="22" y1="2" y2="22"></line>
                      </svg>
                    ) : (
                      <svg
                        className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#bbb"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-10">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none"
                >
                  {translator.getTranslation(lang!, "registerTitle")}
                </button>
              </div>
            </Form>
          </div>

          <div className="mt-4">
            <p className="text-sm text-center mt-6">
              {translator.getTranslation(lang!, "yesAccount")}
              <Link
                to={`/auth/?lang=${lang}`}
                className="text-indigo-800 font-semibold hover:underline ml-1 whitespace-nowrap"
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
