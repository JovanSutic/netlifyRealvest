import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  useActionData,
  useLocation,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { useEffect, useState } from "react";
import Alert from "../components/alert";
import { createSupabaseServerClient } from "../supabase.server";
import { AuthError } from "@supabase/supabase-js";
import { forgetSchema } from "../data/schema/validators";
import { getParamValue } from "../utils/params";
import { FinalError } from "../types/component.types";
import NavigationColumn from "../components/navigation/NavigationColumn";
import { LangType } from "../types/dashboard.types";

export const meta: MetaFunction = ({ location }) => {
  const lang = getParamValue(location.search, "lang", "sr");
  const translator = new Translator("auth");
  return [
    { title: translator.getTranslation(lang, "forgetMetaTitle") },
    {
      name: "description",
      content: translator.getTranslation(lang, "forgetMetaDesc"),
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request);
  const lang = new URL(request.url).searchParams.get("lang") || "sr";

  let isError = false;
  let finalError: FinalError | null = null;
  try {
    const {data: userData} = await supabaseClient.auth.getUser();

    if (userData.user?.role === "authenticated") {
      return redirect(`/offer/?lang=${lang}`);
    }
  } catch (error) {
    isError = true;
    finalError = error as FinalError;
  }

  if (isError) {
    throw json({ error: finalError?.message, lang }, { status: 400 });
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const formData = await request.formData();
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  const email = formData.get("email");

  try {
    const { success, error: zError } = forgetSchema.safeParse({
      email,
    });

    if (zError) {
      return json({ success: false, error: zError }, { headers, status: 400 });
    }

    if (success) {
      const { error: resetError } =
        await supabaseClient.auth.resetPasswordForEmail(email as string, {
          redirectTo: `${process.env.BASE_URL}/auth/redirect`,
        });

      if (resetError) {
        return json(
          { success: false, error: resetError as AuthError },
          { headers, status: 500 }
        );
      } else {
        return redirect(`/auth/success?lang=${lang}&referer=recovery`, {
          headers,
        });
      }
    }
  } catch (error) {
    return json(
      { success: false, error: error as AuthError },
      { headers, status: 500 }
    );
  }

  return null;
};

export default function AuthForgetPass() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const location = useLocation();
  
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>();
  const [apiError, setApiError] = useState<string>();

  const actionData = useActionData<typeof action>();

  const translator = new Translator("auth");
  const lang = (searchParams.get("lang") as LangType) || "sr";

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      setEmail("");
    }

    if (actionData && "error" in actionData && "issues" in actionData.error) {
      const emailErrorCatch = actionData?.error.issues.filter((issue) =>
        issue.path?.includes("email")
      );

      if (emailErrorCatch.length) {
        setEmailError(
          translator.getTranslation(lang!, emailErrorCatch[0].message)
        );
      }
      if (!emailErrorCatch.length && emailError) {
        setEmailError("");
      }
    }

    if (
      actionData &&
      "error" in actionData &&
      !("issues" in actionData.error) &&
      emailError
    ) {
      if (emailError) {
        setEmailError("");
      }
    }

    if (
      actionData &&
      "success" in actionData &&
      !actionData.success &&
      actionData.error?.name === "AuthApiError"
    ) {
      setApiError(translator.getTranslation(lang!, "authApiError"));
    }
  }, [actionData, lang]);

  useEffect(() => {
    if (location.pathname || location.search) {
      setIsNavOpen(false);
    }
  }, [location.pathname, location.search]);

  return (
    <>
      <NavigationColumn
        isOpen={isNavOpen}
        toggleOpen={() => setIsNavOpen(!isNavOpen)}
        lang={lang}
        url={location.pathname}
      />
      <div className="w-full flex justify-center font-[sans-serif] border-t-[1px] border-gray-300 text-[#333] p-4 h-auto">
        <Alert
          type="error"
          isOpen={apiError !== undefined}
          title={translator.getTranslation(lang!, "errorTitle")}
          text={apiError || ""}
          close={() => setApiError(undefined)}
        />
        <div className="lg:w-1/3 md:w-1/2 sm:w-3/4 w-full">
          <div className="rounded-2xl px-2 md:px-6 mt-4 md:mt-8 relative z-10">
            <div className="mb-10">
              <h3 className="text-3xl text-center font-extrabold text-slate-800 mb-3">
                {translator.getTranslation(lang!, "passForgot")}
              </h3>
              <h3 className="text-sm text-center text-slate-400">
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
                      placeholder={translator.getTranslation(
                        lang!,
                        "emailInput"
                      )}
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
                  {emailError && (
                    <span className="text-red-500 text-sm block">
                      {emailError}
                    </span>
                  )}
                </div>
                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={navigation.state === "submitting" || !email}
                    className="w-full py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-no-drop focus:outline-none"
                  >
                    {translator.getTranslation(lang!, "linkBtn")}
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
                {translator.getTranslation(lang!, "backTo")}
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
    </>
  );
}
