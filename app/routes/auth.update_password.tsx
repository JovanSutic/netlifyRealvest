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
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { Translator } from "../data/language/translator";
import { useEffect, useState } from "react";
import Alert from "../components/alert";
import { createSupabaseServerClient } from "../supabase.server";
import { AuthError } from "@supabase/supabase-js";
import { changePassSchema } from "../data/schema/validators";
import { authCookie, refreshCookie } from "../utils/cookies";

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
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  try {
    const { supabaseClient } = createSupabaseServerClient(request);
    const cookie = request.headers.get("Cookie");
    const accessToken = await authCookie.parse(cookie);
    const refreshToken = await refreshCookie.parse(cookie);
    if (accessToken && refreshToken) {
      const { error: sessionError } =
        await supabaseClient.auth.setSession({
          access_token: accessToken || "",
          refresh_token: refreshToken || "",
        });
      if (sessionError) {
        console.log(sessionError);
      }
    } else {
      return redirect(`/?lang=${lang}`);
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const lang = new URL(request.url).searchParams.get("lang") || "sr";
  const formData = await request.formData();
  const { supabaseClient, headers } = createSupabaseServerClient(request);
  const password = formData.get("password");
  const confirmPass = formData.get("confirmPass");

  try {
    const { success, error: zError } = changePassSchema.safeParse({
      password,
      confirmPass,
    });

    if (zError) {
      return json({ success: false, error: zError }, { headers, status: 400 });
    }

    if (success) {
      let flag = false;
      const { data: sessionData, error: sessionError } =
        await supabaseClient.auth.getSession();

      if (sessionError) {
        console.log(sessionError);
      }
      if (sessionData.session) {
        flag = true;
      } else {
        const cookie = request.headers.get("Cookie");
        const accessToken = await authCookie.parse(cookie);
        const refreshToken = await refreshCookie.parse(cookie);
        if (accessToken && refreshToken) {
          const { data: setSessionData, error: setSessionError } =
            await supabaseClient.auth.setSession({
              access_token: accessToken || "",
              refresh_token: refreshToken || "",
            });
          if (setSessionError) {
            console.log(sessionError);
          }

          if (setSessionData) {
            flag = true;
          }
        }
      }

      if (flag) {
        const { error: passError } = await supabaseClient.auth.updateUser({
          password: password as string,
        });
        if (passError) {
          console.log(passError);
          return json(
            { success: false, error: passError as AuthError },
            { headers, status: 500 }
          );
        }
        return redirect(`/auth?lang=${lang}&success=recovery`);
      }
    }
  } catch (error) {
    console.log(error);
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

  const [password, setPassword] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [passError, setPassError] = useState<string>();
  const [confirmPassError, setConfirmPassError] = useState<string>();
  const [apiError, setApiError] = useState<string>();

  const actionData = useActionData<typeof action>();

  const translator = new Translator("auth");
  const lang = searchParams.get("lang") || "sr";
  const errorLink = searchParams.get("error");

  useEffect(() => {
    if (actionData && "success" in actionData && actionData.success) {
      setPassword("");
      setConfirmPass("");
    }

    if (actionData && "error" in actionData && "issues" in actionData.error) {
      const passwordErrorCatch = actionData?.error.issues.filter((issue) =>
        issue.path?.includes("password")
      );
      const confirmPassErrorCatch = actionData?.error.issues.filter((issue) =>
        issue.path?.includes("confirmPass")
      );

      if (passwordErrorCatch.length) {
        setPassError(
          translator.getTranslation(lang!, passwordErrorCatch[0].message)
        );
      }
      if (!passwordErrorCatch.length && passError) {
        setPassError("");
      }

      if (confirmPassErrorCatch.length) {
        setConfirmPassError(
          translator.getTranslation(lang!, confirmPassErrorCatch[0].message)
        );
      }
      if (!confirmPassErrorCatch.length && confirmPassError) {
        setConfirmPassError("");
      }
    }

    if (
      actionData &&
      "error" in actionData &&
      !("issues" in actionData.error) &&
      (confirmPassError || passError)
    ) {
      if (confirmPassError) {
        setConfirmPassError("");
      }
      if (passError) {
        setPassError("");
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

  return (
    <div className="w-full flex justify-center bg-gray-100 font-[sans-serif] text-[#333] h-full md:min-h-screen p-4 sm:h-auto h-screen">
      <Alert
        type="error"
        isOpen={apiError !== undefined}
        title={translator.getTranslation(lang!, "errorTitle")}
        text={apiError || ""}
        close={() => setApiError(undefined)}
      />
      {errorLink ? (
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
                {translator.getTranslation(lang!, "errorTitle")}
              </h3>
              <h3 className="text-sm text-center text-slate-400">
                {translator.getTranslation(lang!, "recoveryErrorText")}
              </h3>
              <hr className="mt-4 border-gray-300" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-center mt-6">
                {translator.getTranslation(lang!, "noActiveRecoveryLink")}
                <Link
                  to={`/auth/forgot_password?lang=${lang}`}
                  className="text-blue-500 font-semibold hover:underline ml-1 whitespace-nowrap"
                >
                  {translator.getTranslation(lang!, "forgotPassAgain")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
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
                {translator.getTranslation(lang!, "changePass")}
              </h3>
              <h3 className="text-sm text-center text-slate-400">
                {translator.getTranslation(lang!, "changePassText")}
              </h3>
              <hr className="mt-4 border-gray-300" />
            </div>
            <div>
              <Form method="post">
                <div className="pt-5 h-[76px]">
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type={!showPass ? "password" : "text"}
                      required
                      className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder={translator.getTranslation(
                        lang!,
                        "passInput"
                      )}
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
                  {passError && (
                    <span className="text-red-500 text-sm block">
                      {passError}
                    </span>
                  )}
                </div>
                <div className="pt-5 h-[76px]">
                  <div className="relative flex items-center">
                    <input
                      name="confirmPass"
                      type={!showConfirm ? "password" : "text"}
                      required
                      className="w-full text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder={translator.getTranslation(
                        lang!,
                        "passConfirmInput"
                      )}
                      value={confirmPass}
                      onChange={(event) => setConfirmPass(event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showPass)}
                      className="absolute top-0 end-0 p-3.5 rounded-e-md"
                    >
                      {!showConfirm ? (
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
                  {confirmPassError && (
                    <span className="text-red-500 text-sm block">
                      {confirmPassError}
                    </span>
                  )}
                </div>
                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={
                      navigation.state === "submitting" ||
                      !password ||
                      !confirmPass
                    }
                    className="w-full py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-no-drop focus:outline-none"
                  >
                    {translator.getTranslation(lang!, "changePass")}
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
      )}
    </div>
  );
}
