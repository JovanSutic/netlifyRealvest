import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import { Translator } from "../data/language/translator";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Partnership" },
  ];
};

export default function Partnership() {
    const [searchParams] = useSearchParams();
    const translator = new Translator("navigation");
    const lang = searchParams.get("lang");
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1>{translator.getTranslation((lang!), 'partnershipHeader')}</h1>
      </div>
    );
}
