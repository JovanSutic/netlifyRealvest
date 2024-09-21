import { Translator } from "../../data/language/translator";
import { LangType, RoleType } from "../../types/dashboard.types";
import { MarketFilter as MarketFilterType } from "../../types/market.types";
import Select from "../select/Select";
import { useEffect, useState } from "react";
import SideWrapper from "../helpers/SideWrapper";
import { m2PriceOptions, priceOptions, sizeOptions } from "../../utils/params";
import ToggleButton from "../toggleButtons/ToggleButton";

const MarketFilter = ({
  isOpen,
  lang,
  filters,
  cityParts,
  toggleOpen,
  submit,
  mobile,
}: {
  isOpen: boolean;
  lang: LangType;
  filters: Partial<MarketFilterType>;
  cityParts: string[];
  toggleOpen: () => void;
  submit: (filters: MarketFilterType) => void;
  mobile: boolean;
  role: RoleType;
}) => {
  const translate = new Translator("dashboard");
  const marketTranslate = new Translator("market");

  const [sizeFrom, setSizeFrom] = useState<string>(sizeOptions[0].toString());
  const [sizeTo, setSizeTo] = useState<string>(
    sizeOptions[sizeOptions.length - 1].toString()
  );
  const [priceFrom, setPriceFrom] = useState<string>(
    priceOptions[0].toString()
  );
  const [priceTo, setPriceTo] = useState<string>(
    priceOptions[priceOptions.length - 1].toString()
  );
  const [m2PriceFrom, setm2PriceFrom] = useState<string>(
    m2PriceOptions[0].toString()
  );
  const [m2PriceTo, setm2PriceTo] = useState<string>(
    m2PriceOptions[m2PriceOptions.length - 1].toString()
  );

  const [rentalAnalysis, setRentalAnalysis] = useState<string>("false");
  const [lowPrice, setLowPrice] = useState<string>("true");
  const [appreciation, setAppreciation] = useState<string>("0");
  const [cityPart, setCityPart] = useState<string>(cityParts[0]);

  const containerW = mobile ? "w-[100%]" : "w-[360px]";

  const isChanged =
    (filters.priceFrom !== priceFrom.toString() ||
      filters.priceTo !== priceTo.toString() ||
      filters.sizeFrom !== sizeFrom.toString() ||
      filters.sizeTo !== sizeTo.toString() ||
      filters.m2PriceFrom !== m2PriceFrom.toString() ||
      filters.m2PriceTo !== m2PriceTo.toString() ||
      filters.rentalAnalysis !== rentalAnalysis ||
      filters.appreciation !== appreciation ||
      filters.lowPrice !== lowPrice ||
      filters.cityPart !== cityPart) &&
    Number(priceFrom) < Number(priceTo) &&
    Number(sizeFrom) < Number(sizeTo) &&
    Number(m2PriceFrom) < Number(m2PriceTo)
      ? true
      : false;

  useEffect(() => {
    if (sizeFrom !== filters.sizeFrom) {
      setSizeFrom(filters.sizeFrom!);
    }
    if (sizeTo !== filters.sizeTo) {
      setSizeTo(filters.sizeTo!);
    }
    if (priceFrom !== filters.priceFrom) {
      setPriceFrom(filters.priceFrom!);
    }
    if (priceTo !== filters.priceTo) {
      setPriceTo(filters.priceTo!);
    }
    if (m2PriceFrom !== filters.m2PriceFrom) {
      setm2PriceFrom(filters.m2PriceFrom!);
    }
    if (m2PriceTo !== filters.m2PriceTo) {
      setm2PriceTo(filters.m2PriceTo!);
    }
    if (rentalAnalysis !== filters.rentalAnalysis) {
      setRentalAnalysis(filters.rentalAnalysis!);
    }
    if (appreciation !== filters.appreciation) {
      setAppreciation(filters.appreciation!);
    }
    if (cityPart !== filters.cityPart) {
      setCityPart(filters.cityPart!);
    }
    if (lowPrice !== filters.lowPrice) {
      setLowPrice(filters.lowPrice!);
    }
  }, [isOpen]);

  return (
    <SideWrapper
      id="marketFilterMenu"
      open={isOpen}
      close={toggleOpen}
      mobile={mobile}
    >
      <ul className="min-h-[700px] overflow-y-scroll md:min-h-auto md:overflow-y-hidden">
        <li className="md:mb-4">
          <div className="flex flex-wrap items-center">
            <p className="w-full text-center font-bold text-xl text-black">
              {translate.getTranslation(lang, "filters")}
            </p>
          </div>
        </li>
        <li className="px-2 mb-2 md:mb-3">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center">
                <ToggleButton
                  fullWidth
                  value={lowPrice}
                  onChange={(value: string) => setLowPrice(value)}
                  options={[
                    {
                      text: marketTranslate.getTranslation(
                        lang,
                        "filterRentalFalse"
                      ),
                      value: "true",
                    },
                    {
                      text: marketTranslate.getTranslation(
                        lang,
                        "filterLowPrice"
                      ),
                      value: "false",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </li>
        <li className="px-2 mb-4 md:mb-3">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center">
                <ToggleButton
                  fullWidth
                  value={rentalAnalysis}
                  onChange={(value: string) => setRentalAnalysis(value)}
                  options={[
                    {
                      text: marketTranslate.getTranslation(
                        lang,
                        "filterRentalFalse"
                      ),
                      value: "false",
                    },
                    {
                      text: marketTranslate.getTranslation(
                        lang,
                        "filterRentalTrue"
                      ),
                      value: "true",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </li>

        <li className="px-2 mb-2 md:mb-3">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center">
                <div className="w-full flex">
                  <label
                    htmlFor="m2PriceFrom"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {marketTranslate.getTranslation(lang, "filterAppreciation")}
                  </label>
                </div>
              </div>
              <div className="w-full flex flex-row justify-center">
                <Select
                  name="appreciation"
                  value={appreciation}
                  setValue={(value: string) => setAppreciation(value)}
                  isFullWidth
                  options={[
                    {
                      text: marketTranslate.getTranslation(lang, "filterAll"),
                      value: "-10",
                    },
                    {
                      text: `${marketTranslate.getTranslation(
                        lang,
                        "filterMore"
                      )} 1%`,
                      value: "1",
                    },
                    {
                      text: `${marketTranslate.getTranslation(
                        lang,
                        "filterMore"
                      )} 3%`,
                      value: "3",
                    },
                    {
                      text: `${marketTranslate.getTranslation(
                        lang,
                        "filterMore"
                      )} 5%`,
                      value: "5",
                    },
                    {
                      text: `${marketTranslate.getTranslation(
                        lang,
                        "filterMore"
                      )} 10%`,
                      value: "10",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </li>
        <li className="px-2 mb-2 md:mb-4">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center">
                <div className="w-full flex">
                  <label
                    htmlFor="m2PriceFrom"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {marketTranslate.getTranslation(lang, "filterCityPart")}
                  </label>
                </div>
              </div>
              <div className="w-full flex flex-row justify-center">
                <Select
                  name="parts"
                  value={cityPart}
                  setValue={(value: string) => setCityPart(value)}
                  isFullWidth
                  options={cityParts.map((item) => ({
                    value: item,
                    text:
                      item === "all"
                        ? marketTranslate.getTranslation(lang, "filterAll")
                        : item,
                  }))}
                />
              </div>
            </div>
          </div>
        </li>
        <hr />
        <li className="px-2 mb-2 md:mb-3 mt-2 md:mt-3">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <label
                    htmlFor="sizeFrom"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {`${translate.getTranslation(
                      lang,
                      "size"
                    )} ${translate.getTranslation(lang, "from")}`}
                  </label>
                </div>
                <div className="w-full flex">
                  <label
                    htmlFor="sizeTo"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {translate.getTranslation(lang, "to")}
                  </label>
                </div>
              </div>

              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <Select
                    name="sizeFrom"
                    value={sizeFrom}
                    isFullWidth={true}
                    setValue={(value) => {
                      setSizeFrom(value);
                    }}
                    options={sizeOptions.map((item) => ({
                      value: item.toString(),
                      text: item.toString(),
                    }))}
                  />
                </div>
                <div className="w-full flex">
                  <Select
                    name="sizeTo"
                    value={sizeTo}
                    isFullWidth={true}
                    setValue={(value) => {
                      setSizeTo(value);
                    }}
                    options={sizeOptions.map((item) => ({
                      value: item.toString(),
                      text: item.toString(),
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </li>
        <li className="px-2 mb-2 md:mb-3">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <label
                    htmlFor="priceFrom"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {`${translate.getTranslation(
                      lang,
                      "price"
                    )} ${translate.getTranslation(lang, "from")}`}
                  </label>
                </div>
                <div className="w-full flex">
                  <label
                    htmlFor="priceTo"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {translate.getTranslation(lang, "to")}
                  </label>
                </div>
              </div>

              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <Select
                    name="priceFrom"
                    value={priceFrom}
                    isFullWidth={true}
                    setValue={(value) => {
                      setPriceFrom(value);
                    }}
                    options={priceOptions.map((item) => ({
                      value: item.toString(),
                      text: item.toString(),
                    }))}
                  />
                </div>
                <div className="w-full flex">
                  <Select
                    name="priceTo"
                    value={priceTo}
                    isFullWidth={true}
                    setValue={(value) => {
                      setPriceTo(value);
                    }}
                    options={priceOptions.map((item) => ({
                      value: item.toString(),
                      text: item.toString(),
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </li>
        <li className="px-2 mb-2 md:mb-3">
          <div className="">
            <div>
              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <label
                    htmlFor="m2PriceFrom"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {`${translate.getTranslation(
                      lang,
                      "filterM2price"
                    )} ${translate.getTranslation(lang, "from")}`}
                  </label>
                </div>
                <div className="w-full flex">
                  <label
                    htmlFor="m2PriceTo"
                    className="text-slate-800 ml-1 text-sm font-semibold"
                  >
                    {translate.getTranslation(lang, "to")}
                  </label>
                </div>
              </div>

              <div className="w-full flex flex-row justify-center gap-2">
                <div className="w-full flex">
                  <Select
                    name="m2PriceFrom"
                    value={m2PriceFrom}
                    isFullWidth={true}
                    setValue={(value) => {
                      setm2PriceFrom(value);
                    }}
                    options={m2PriceOptions.map((item) => ({
                      value: item.toString(),
                      text: item.toString(),
                    }))}
                  />
                </div>
                <div className="w-full flex">
                  <Select
                    name="m2PriceTo"
                    value={m2PriceTo}
                    isFullWidth={true}
                    setValue={(value) => {
                      setm2PriceTo(value);
                    }}
                    options={m2PriceOptions.map((item) => ({
                      value: item.toString(),
                      text: item.toString(),
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </li>

        <li className={`relative mt-3 md:mt-0 md:fixed md:bottom-[20px] right-0 ${containerW}`}>
          <div className="w-full flex flex-row justify-center gap-8 px-2 py-3">
            <button
              onClick={() =>
                submit({
                  sizeFrom,
                  sizeTo,
                  priceFrom,
                  priceTo,
                  m2PriceFrom,
                  m2PriceTo,
                  rentalAnalysis,
                  appreciation,
                  cityPart,
                  lowPrice,
                })
              }
              disabled={!isChanged}
              className="text-md px-6 py-2 bg-blue-400 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-blue-600 focus:outline-none disabled:bg-gray-300 disabled:cursor-no-drop"
            >
              {translate.getTranslation(lang, "apply")}
            </button>
            <button
              onClick={toggleOpen}
              className="text-md px-6 py-2 bg-gray-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-gray-700 focus:outline-none "
            >
              {translate.getTranslation(lang, "close")}
            </button>
          </div>
        </li>
      </ul>
    </SideWrapper>
  );
};

export default MarketFilter;
