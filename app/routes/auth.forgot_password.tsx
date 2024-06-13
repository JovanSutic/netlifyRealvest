import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { useState } from "react";
import { ZodError, z } from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "Register to Estate Insights" },
    {
      name: "description",
      content: "Register to Estate Insights to get best property insights",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");

  const schema = z.object({
    email: z.string().email({ message: "Please provide valid email." }),
  })

  try {
    schema.parse({
      email,
    });
  } catch (error) {
    return error as ZodError;
  }

  return null;
};

export default function AuthForgetPass() {
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState<string>("");
  
  const actionData = useActionData<typeof action>();
  const emailError = actionData?.issues.filter((issue) =>
    issue.path?.includes("email")
  );

  const translator = new Translator("auth");
  const lang = searchParams.get("lang");
  return (
    <div className="w-full flex justify-center items-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen">
      <div className="lg:w-1/3 md:w-1/2 sm:w-3/4 w-full justify-center mx-auto">
        <div className=" bg-white rounded-2xl p-6 -mt-24 relative z-10 shadow-lg">
          <div className="mb-10">
            <h3 className="text-3xl font-extrabold text-slate-800 mb-3">
              {translator.getTranslation(lang!, "passForgot")}
            </h3>
            <h3 className="text-sm text-slate-400">
              {translator.getTranslation(lang!, "passDescription")}
            </h3>
          </div>
          <div>
            <Form method="post">
              <div className="pt-5 h-[76px]">
                <div className="relative flex items-center">
                  <input
                    name="email"
                    type="text"
                    required
                    className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    placeholder={translator.getTranslation(lang!, "emailInput")}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
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
                {(emailError || [])?.length > 0 && (
                  <span className="text-red-500 text-sm block">
                    {emailError?.[0].message}
                  </span>
                )}
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none"
                >
                  {translator.getTranslation(lang!, "linkBtn")}
                </button>
              </div>
            </Form>
          </div>

          <div className="mt-4">
            <p className="text-sm text-center mt-6">
              {translator.getTranslation(lang!, "backTo")}
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
