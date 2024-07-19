import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { TColumn, TLine, TPage } from "../components/layout";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { default as ErrorPage } from "../components/error";
import { isMobile } from "../utils/params";
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
      <TPage color="bg-white" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="flex flex-row justify-between">
              <div className="flex items-center">
                <div className="w-[160px] border-b-black border-b-2 ">
                  <img
                    src="logo1.png"
                    alt="Realvest logo"
                    className="max-w-full"
                  />
                </div>
              </div>
              <div className="flex self-center">
                <div className="">
                  <Link
                    to={`/?lang=${lang === "sr" ? "en" : "sr"}`}
                    className="text-md font-semibold text-blue-500 transform hover:text-blue-700"
                  >
                    {lang === "sr" ? "english version" : "srpska verzija"}
                  </Link>
                </div>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage mobile={mobile}>
        <TLine columns={12} gap={4}>
          <TColumn span={5}>
            <div className="flex flex-row items-center h-full">
              <div className="flex flex-col items-center py-10">
                <h1 className="text-[42px] font-extrabold text-center leading-[50px] mb-10">
                  Podaci koji ulivaju samopouzdanje
                </h1>
                <h3 className="text-[20px] text-gray-600 leading-8 mb-12">
                  Realvest vas povezuje sa relevantnim tržišnim podacima koji
                  olakšavaju proces donošenja odluka pri kupovini, prodaji ili
                  izdavanju nekretinina.
                </h3>
                <Link
                  to={`auth/register/?lang=${lang}`}
                  className="px-6 py-3 text-md font-semibold text-white bg-blue-500 rounded-full  transition-all duration-300 transform hover:bg-blue-700 focus:ring-2 focus:outline-none  focus:ring-opacity-50"
                >
                  Napravi nalog besplatno
                </Link>
              </div>
            </div>
          </TColumn>
          <TColumn span={7} start={6}>
            <div className="flex flex-col items-center py-10">
              <div className="w-full border-[1px] border-solid border-slate-300 rounded-xl overflow-hidden">
                <img src="firstLineGif.gif" alt="Realvest demo gif" />
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage color="bg-gray-700" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="w-[70%] m-auto py-2 mt-10 mb-[72px]">
              <h3 className="w-full text-3xl font-bold text-center text-white">
                Korisni podaci, potpuno besplatno dostupni uz samo 3 klika.
              </h3>
            </div>
          </TColumn>
        </TLine>
        <TLine columns={4} gap={6}>
          <TColumn span={1}>
            <div className="mb-12">
              <div className="flex flex-col items-center">
                <div className="text-blue-200 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-row mt-6">
                <p className="text-white text-xl text-center">
                  Izaberite koliko stare podatke treba uzeti u obzir prilikom
                  generisanja izveštaja.
                </p>
              </div>
            </div>
          </TColumn>
          <TColumn span={1} start={2}>
            <div className="mb-12">
              <div className="flex flex-col items-center">
                <div className="text-blue-300 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-row mt-6">
                <p className="text-white text-xl text-center">
                  Izaberite konkretnu veličinu gradske zone koja vas interesuje.
                </p>
              </div>
            </div>
          </TColumn>
          <TColumn span={1} start={3}>
            <div className="mb-12">
              <div className="flex flex-col items-center">
                <div className="text-blue-300 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-16"
                  >
                    <path
                      fillRule="evenodd"
                      d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-row mt-6">
                <p className="text-white text-xl text-center">
                  Kliknite na tačku na mapi za koju želite da vam bude centar
                  zone.
                </p>
              </div>
            </div>
          </TColumn>
          <TColumn span={1} start={4}>
            <div className="mb-12">
              <div className="flex flex-col items-center">
                <div className="text-blue-200 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 2.25a.75.75 0 0 0 0 1.5H3v10.5a3 3 0 0 0 3 3h1.21l-1.172 3.513a.75.75 0 0 0 1.424.474l.329-.987h8.418l.33.987a.75.75 0 0 0 1.422-.474l-1.17-3.513H18a3 3 0 0 0 3-3V3.75h.75a.75.75 0 0 0 0-1.5H2.25Zm6.04 16.5.5-1.5h6.42l.5 1.5H8.29Zm7.46-12a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Zm-3 2.25a.75.75 0 0 0-1.5 0v3.75a.75.75 0 0 0 1.5 0V9Zm-3 2.25a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-row mt-6">
                <p className="text-white text-xl text-center">
                  Pred vama su detaljni podaci o tržištu nekretnina, specifični
                  za izabranu gradsku zonu.
                </p>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage color="bg-white" mobile={mobile}>
        <TLine columns={2} mt={8}>
          <TColumn span={1}>
            <div className="py-10 px-6">
              <div className="relative w-full flex flex-col h-[340px]">
                <img
                  src="place_map.png"
                  alt="Location focus"
                  className="rounded-3xl max-w-full h-full object-fill"
                />
                <div className="absolute w-full h-full block top-0 shadow-[inset_-10px_-10px_60px_40px_rgb(255,255,255)]"></div>
              </div>
            </div>
          </TColumn>
          <TColumn span={1} start={2}>
            <div className="py-16 px-6 font-[sans-serif]">
              <h6 className="text-3xl font-bold mb-10 text-slate-800">
                Finansijski potencijal nekretnine
              </h6>
              <p className="text-xl text-slate-600 leading-2xl">
                Prikazujemo podatake koji mogu da vam ukažu da li bi nekretnina
                u određenoj zoni, sa određenim karakteristikama bila dobra
                investicija ili kupovina. Primarna informacija koju pratimo je
                kretanje prodajne cene nekretnina kroz vreme. Ali pratimo i
                potencijal nekretnine da generiše prihod kroz izdavanje.
              </p>
            </div>
          </TColumn>
        </TLine>
        <TLine columns={2} mb={8}>
          <TColumn span={1}>
            <div className="py-16 px-6 font-[sans-serif]">
              <h6 className="text-3xl font-bold mb-10 text-slate-800">
                Brze i konkretne informacije
              </h6>
              <p className="text-xl text-slate-600 leading-2xl">
                Generišemo grafikone, tabele i izveštaje koji pokazuju dinamiku
                cena, broja prodaje, cena kvadrata itd. u označenoj zoni. Svaki
                prikaz se sastoji iz konkretnih informacija koje su relevantne
                za filtere koje ste odabrali. Podaci se kontinuirano obrađuju sa
                težnjom prikaza što konkretnijih informacija.
              </p>
            </div>
          </TColumn>
          <TColumn span={1} start={2}>
            <div className="py-10 px-6">
              <div className="relative w-full flex flex-col h-[340px]">
                <img
                  src="data_img.jpeg"
                  alt="Data focus"
                  className="rounded-3xl max-w-full h-full object-fill"
                />
                <div className="absolute w-full h-full block top-0 shadow-[inset_-10px_-10px_60px_40px_rgb(255,255,255)]"></div>
              </div>
            </div>
          </TColumn>
        </TLine>
      </TPage>
      <TPage color="bg-gray-700" mobile={mobile}>
        <TLine columns={1}>
          <TColumn span={1}>
            <div className="py-16 px-6 font-[sans-serif]"></div>
          </TColumn>
        </TLine>
      </TPage>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorPage link={"/"} />;
}
