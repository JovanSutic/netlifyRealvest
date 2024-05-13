import type { MetaFunction } from "@remix-run/node";
import { Form, Link, useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";
import Tabs from "../components/tabs";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign in to Estate Insights" },
    {
      name: "description",
      content: "Sign in to Estate Insights to get best property insights",
    },
  ];
};

export default function AuthSign() {
  const [signInType, setSignInType] = useState<string>("2");
  const [showPass, setShowPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [searchParams] = useSearchParams();
  const translator = new Translator("auth");
  const lang = searchParams.get("lang");
  return (
    <div className="w-full flex justify-center items-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4">
      <div className="w-1/4 md:w-1/3 sm:w-full justify-center mx-auto">
        <div className=" bg-white rounded-2xl p-6 -mt-24 relative z-10 shadow-lg">
          <div className="mb-10">
            <h3 className="text-3xl font-extrabold text-slate-800 mb-3">
              {translator.getTranslation(lang!, "signTitle")}
            </h3>
            <p className="text-sm text-slate-400">
              {translator.getTranslation(lang!, "signDescription")}
            </p>
          </div>
          <div>
            <div>
              <button className="w-full py-2 px-4 text-sm center rounded border-[1px] border-solid border-slate-300 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  className="inline mr-2"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                    data-original="#fbbd00"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                    data-original="#0f9d58"
                  />
                  <path
                    fill="#31aa52"
                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                    data-original="#31aa52"
                  />
                  <path
                    fill="#3c79e6"
                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                    data-original="#3c79e6"
                  />
                  <path
                    fill="#cf2d48"
                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                    data-original="#cf2d48"
                  />
                  <path
                    fill="#eb4132"
                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                    data-original="#eb4132"
                  />
                </svg>
                {translator.getTranslation(lang!, "googleSign")}
              </button>
            </div>
            <hr className="mb-2 border-gray-300" />
            <Tabs
              options={[
                { text: translator.getTranslation(lang!, "magicLink"), value: "1" },
                { text: translator.getTranslation(lang!, "password"), value: "2" },
              ]}
              value={signInType}
              onChange={setSignInType}
            />
          </div>
          {signInType === "2" ? (
            <Form>
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
              <div className="flex items-center justify-between gap-2 mt-4">
                <div>
                  <Link
                    to={`/auth/forgot_password?lang=${lang}`}
                    className="text-indigo-800 text-sm hover:underline"
                  >
                    {translator.getTranslation(lang!, "passForgot")}
                  </Link>
                </div>
              </div>
              <div className="mt-10">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none"
                >
                  {translator.getTranslation(lang!, "signTitle")}
                </button>
              </div>
            </Form>
          ) : (
            <Form>
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
              <div className="mt-10">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none"
                >
                  {translator.getTranslation(lang!, "sendLink")}
                </button>
              </div>
            </Form>
          )}

          <div className="mt-4">
            <p className="text-sm text-center mt-6">
              {translator.getTranslation(lang!, "noAccount")}
              <Link
                to={`/auth/register/?lang=${lang}`}
                className="text-indigo-800 font-semibold hover:underline ml-1 whitespace-nowrap"
              >
                {translator.getTranslation(lang!, "register")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
