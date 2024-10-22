import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "@remix-run/react";
import { json, LinksFunction } from "@remix-run/node";
import appStyles from "./app.css?url";
import stylesheet from "../node_modules/tailwindcss/tailwind.css?url";
import { default as ErrorPage } from "./components/error";
import * as gtag from "./utils/gtag";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles},
  { rel: "stylesheet", href: stylesheet},
];

export const loader = async () => {
  return json({
    gaTrackingId: process.env.GOOGLE_TAG_ID,
    baseUrl: process.env.BASE_URL,
  } as const);
};

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { gaTrackingId, baseUrl } = useRouteLoaderData<typeof loader>("root")!;
  const isProd = baseUrl === "https://yourealvest.com";

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag?.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {process.env.NODE_ENV !== "development" && gaTrackingId && isProd ? (
          <>
            {/* <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            /> */}
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        ) : null}
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <ErrorPage link={"/?lang=sr"} />;
  }

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return <ErrorPage link={"/?lang=sr"} lang={error.data.lang || 'sr'} />;
    }
    
  }

  return <ErrorPage link={"/?lang=sr"} />;
}

export default function App() {
  return <Outlet />;
}
