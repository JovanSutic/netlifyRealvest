import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  json,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { useEffect, useState } from "react";
import { registrationSchema } from "../data/schema/validators";
import { ZodError } from "zod";
import { createSupabaseServerClient } from "../supabase.server";
import Alert from "../components/alert";

export const meta: MetaFunction = () => {
  return [
    { title: "Register to Estate Insights" },
    {
      name: "description",
      content: "Register to Estate Insights to get best property insights",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const user = await supabaseClient.auth.getUser();
  if (user?.data?.user?.role === "authenticated") {
    throw redirect(`/dashboard?lang=${lang}`);
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const name = formData.get("name");
  const password = String(formData.get("password"));

  try {
    const { success, error: zError } = registrationSchema.safeParse({
      email,
      name,
      password,
    });

    const { supabaseClient, headers } = createSupabaseServerClient(request);

    if (success) {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      if (error) {
        return json({ success: false, error: error }, { headers, status: 400 });
      } else {
        return redirect(`/auth/success?lang=${lang}`, { headers });
      }
    } else {
      return json({ success: false, error: zError }, { headers, status: 400 });
    }
  } catch (error) {
    return error as ZodError;
  }

  return null;
};

export default function AuthRegister() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang");

  const navigation = useNavigation();

  const [apiError, setApiError] = useState<string>();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const actionData = useActionData<typeof action>();
  const translator = new Translator("auth");

  useEffect(() => {
    if (actionData && "error" in actionData && "issues" in actionData.error) {
      const nameErrorCatch = actionData?.error?.issues.filter((issue) =>
        issue.path?.includes("name")
      );
      const emailErrorCatch = actionData?.error.issues.filter((issue) =>
        issue.path?.includes("email")
      );
      const passwordErrorCatch = actionData?.error.issues.filter((issue) =>
        issue.path?.includes("password")
      );

      if (nameErrorCatch.length)
        setNameError(
          translator.getTranslation(lang!, nameErrorCatch[0].message)
        );
      if (emailErrorCatch.length)
        setEmailError(
          translator.getTranslation(lang!, emailErrorCatch[0].message)
        );
      if (passwordErrorCatch.length)
        setPasswordError(
          translator.getTranslation(lang!, passwordErrorCatch[0].message)
        );
    }

    if (
      (nameError || emailError || passwordError) &&
      !("issues" in actionData!)
    ) {
      if (nameError) setNameError("");
      if (emailError) setEmailError("");
      if (passwordError) setPasswordError("");
    }

    if (
      actionData &&
      "error" in actionData &&
      !actionData.success &&
      actionData.error?.name === "AuthApiError"
    ) {
      setApiError(translator.getTranslation(lang!, "registrationApiError"));
    }
  }, [actionData]);
  return (
    <div className="w-full flex justify-center items-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen">
      <Alert
        type="error"
        isOpen={apiError !== undefined}
        title="Error"
        text={apiError || ""}
        close={() => setApiError(undefined)}
      />
      <div className="lg:w-1/3 md:w-1/2 sm:w-3/4 w-full justify-center mx-auto">
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
            <Form method="post">
              <div className="pt-5 h-[82px]">
                <div className="relative flex items-center">
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                    placeholder={translator.getTranslation(lang!, "nameInput")}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
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
                {(nameError || [])?.length > 0 && (
                  <span className="text-red-500 text-sm block">
                    {nameError}
                  </span>
                )}
              </div>
              <div className="pt-5 h-[82px]">
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
                    {emailError}
                  </span>
                )}
              </div>
              <div className="pt-5 h-[82px]">
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
                {(passwordError || [])?.length > 0 && (
                  <span className="text-red-500 text-sm block">
                    {passwordError}
                  </span>
                )}
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  disabled={navigation.state === "submitting"}
                  className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                >
                  {translator.getTranslation(lang!, "registerTitle")}
                  {navigation.state === "submitting" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      fill="#fff"
                      className="ml-2 inline animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
                        data-original="#000000"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </Form>
          </div>

          <div className="mt-4">
            <p className="text-sm text-center mt-6">
              {translator.getTranslation(lang!, "yesAccount")}
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
