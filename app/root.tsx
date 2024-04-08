import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { getMuiLinks } from "./mui/getMuiLinks";
import { MuiMeta } from "./mui/MuiMeta";
import { MuiDocument } from "./mui/MuiDocument";
import appStyles from "./app.css?url";
import { default as ErrorPage } from "./components/error";
import Navigation from "./components/navigation";
import { isMobile } from "./utils/params";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  ...getMuiLinks(),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userAgent = request.headers.get("user-agent");
  return json({ ok: true, mobile: isMobile(userAgent!) });
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <ErrorPage link={"/portfolio/?lang=sr"} />;
  }

  if (!isRouteErrorResponse(error)) {
    return <ErrorPage link={"/portfolio/?lang=sr"} />;
  }

  if (error.status === 404) {
    return <ErrorPage link={"/portfolio/?lang=sr"} />;
  }

  return <ErrorPage link={"/portfolio/?lang=sr"} />;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData: { mobile: boolean } | undefined = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <MuiMeta />
        <Links />
      </head>
      <body>
        <header>
          <Navigation mobile={loaderData?.mobile || false} />
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <MuiDocument>
      <Outlet />
    </MuiDocument>
  );
}
