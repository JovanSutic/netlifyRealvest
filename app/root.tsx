import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import appStyles from "./app.css?url";
import stylesheet from "../node_modules/tailwindcss/tailwind.css?url";
import { default as ErrorPage } from "./components/error";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: stylesheet },
];

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <ErrorPage link={"/?lang=sr"} />;
  }

  if (!isRouteErrorResponse(error)) {
    return <ErrorPage link={"/?lang=sr"} />;
  }

  if (error.status === 404) {
    return <ErrorPage link={"/?lang=sr"} />;
  }

  return <ErrorPage link={"/?lang=sr"} />;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
