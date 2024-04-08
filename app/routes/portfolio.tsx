import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import Button from "../components/button";
import { Translator } from "../data/language/translator";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to portfolio" },
  ];
};

export default function Portfolio() {
  const [searchParams] = useSearchParams();
  const translator = new Translator("navigation");
    const lang = searchParams.get("lang");
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
        <h1>{translator.getTranslation((lang || 'sr'), 'portfolioHeader')}</h1>
        <Button text="test" onClick={() => console.log('clock')} />
        <Button text="test1" size="small" onClick={() => console.log('clock')} />
        <Button text="test2" size="big" onClick={() => console.log('clock')} />
        <Button text="test3" variant="secondary" onClick={() => console.log('clock')} />
        <Button text="test4" variant="tertiary" onClick={() => console.log('clock')} />
      </div>
    );
}
