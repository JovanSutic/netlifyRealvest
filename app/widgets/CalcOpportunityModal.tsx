import { useEffect, useState } from "react";
import { TableHeader, TableRow } from "../components/table/OpportunityTable";
import { normalizeUrlString } from "../utils/opportunity";
import Modal from "../components/modal";
import {
  OpportunityListItem,
  OpportunityType,
  RentalAverage,
} from "../types/dashboard.types";
import { getNumberWithDecimals } from "../utils/market";
import Map from "../components/map/index.client";
import { ClientOnly } from "../components/helpers/ClientOnly";
import Select from "../components/select/Select";

const CalcOpportunityModal = ({
  isOpen,
  listItem,
  rentalAverage,
  onClose,
  onAdditional,
  onSubmit,
}: {
  isOpen: boolean;
  listItem: OpportunityListItem | null;
  rentalAverage: RentalAverage | null;
  onClose: () => void;
  onAdditional: () => void;
  onSubmit: (opportunity: OpportunityType) => void;
}) => {
  const [center, setCenter] = useState<number[]>();
  const [isRentalAverage, setIsRentalAverage] = useState<boolean>(false);
  const [newRent, setNewRent] = useState<number>();
  const [renovation, setRenovation] = useState<string>("no");
  const [discount, setDiscount] = useState<number>(0);
  const [calculatedAd, setCalculatedAd] =
    useState<OpportunityListItem | null>();

  const getRenovation = (description: string, renovation: string): string => {
    if (renovation === "no")
      return description
        .replace("za renoviranje", "")
        .replace("za polu renoviranje", "");
    if (renovation === "half") return `${description} za polu renoviranje.`;

    if (renovation === "full") return `${description} za renoviranje.`;

    return description;
  };

  const recalculateAd = (): OpportunityListItem | undefined => {
    if (!calculatedAd?.id) return undefined;
    if (newRent && calculatedAd?.id) {
      return {
        ...calculatedAd,
        price: ((100 - discount) / 100) * (listItem?.price || 1),
        average_rental: Number(newRent),
        rent_ratio: Number(newRent) / (listItem?.price || 1),
        description: getRenovation(listItem?.description || "", renovation),
      };
    }

    return { ...calculatedAd };
  };

  useEffect(() => {
    if (isOpen) {
      setCalculatedAd(listItem);
      setNewRent(listItem?.average_rental);
    } else {
      setCalculatedAd(undefined);
      setDiscount(0);
      setNewRent(undefined);
      setRenovation("no");
      setCenter(undefined);
      setIsRentalAverage(false);
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} width="large">
      <>
        <div className="text-center mb-3">
          <h3 className="text-center font-bold text-[22px] mb-1">{`The new recalculation model for id: ${calculatedAd?.id}`}</h3>
          <a
            href={`https://www.nekretnine.rs${listItem?.link}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Property Link
          </a>
          <a
            href={`https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/izdavanje/deo-grada/${normalizeUrlString(
              listItem?.city_part?.toLowerCase() || ""
            )}/grad/beograd/lista/po-stranici/10/`}
            target="_blank"
            rel="noreferrer"
            className="ml-4 font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            Rental Alternatives
          </a>
        </div>
        <div className="w-full h-[500px] overflow-y-auto">
          <div className="w-full grid grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="new_rent" className="text-sm text-gray-500 ml-2">
                New rent
              </label>
              <input
                name="new_rent"
                type="text"
                required
                className="w-full text-sm border-[1px] border-gray-300 focus:border-blue-600 rounded-md px-2 py-3 outline-none"
                placeholder="New rent"
                value={newRent}
                onChange={(event) => setNewRent(Number(event.target.value))}
              />
            </div>
            <div>
              <label htmlFor="discount" className="text-sm text-gray-500 ml-2">
                Discount %
              </label>
              <input
                name="discount"
                type="text"
                required
                className="w-full text-sm border-[1px] border-gray-300 focus:border-blue-600 rounded-md px-2 py-3 outline-none"
                placeholder="New rent"
                value={discount}
                onChange={(event) => setDiscount(Number(event.target.value))}
              />
            </div>
            <div>
              <label
                htmlFor="opportunityRenovation"
                className="text-sm text-gray-500 ml-2"
              >
                Renovation
              </label>
              <Select
                name="opportunityRenovation"
                isFullWidth
                value={renovation}
                setValue={(value) => setRenovation(value)}
                options={[
                  {
                    value: "no",
                    text: "No renovation needed",
                  },
                  {
                    value: "half",
                    text: "Half renovation needed",
                  },
                  {
                    value: "full",
                    text: "Full renovation needed",
                  },
                ]}
              />
            </div>
            <div className="pt-8 text-center">
              <button
                className="text-md px-5 py-1 bg-blue-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-blue-700 focus:outline-none"
                onClick={() => setCalculatedAd(recalculateAd())}
              >
                Recalculate
              </button>
            </div>
          </div>
          <div className="w-full">
            <div className="overflow-x-auto shadow-md sm:rounded-lg mb-8">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <TableHeader short={true} />
                <tbody>
                  {calculatedAd !== null && calculatedAd !== undefined && (
                    <TableRow
                      key={calculatedAd.id}
                      item={calculatedAd}
                      short={true}
                      onCalc={() => console.log("a")}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full border-t-[1px] border-grey-600 pt-4">
            <h3 className="text-center text-22 mb-4">Location data</h3>
            <div className="w-full grid grid-cols-2 gap-4">
              <ClientOnly
                fallback={
                  <div
                    id="skeleton"
                    style={{ height: "100%", background: "#d1d1d1" }}
                  />
                }
              >
                {() => <Map range={250} setCenter={setCenter} isShort={true} />}
              </ClientOnly>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p>Old map data:</p>
                  <p>{`Lat: ${listItem?.lat}`}</p>
                  <p>{`Lng: ${listItem?.lng}`}</p>
                </div>

                <div className="text-center">
                  <p>New map data:</p>
                  <p>{`Lat: ${getNumberWithDecimals(center?.[0] || 0, 6)}`}</p>
                  <p>{`Lng: ${getNumberWithDecimals(center?.[1] || 0, 6)}`}</p>
                </div>

                <div className="text-center">
                  <p>Rental average:</p>
                  {rentalAverage !== null && isRentalAverage && (
                    <>
                      <p>{`All: ${getNumberWithDecimals(
                        rentalAverage.allAverage,
                        2
                      )}`}</p>
                      <p>{`Pair: ${getNumberWithDecimals(
                        rentalAverage.pairAverage,
                        2
                      )}`}</p>
                    </>
                  )}
                </div>

                <div className="">
                  <button
                    onClick={() => {
                      onAdditional();
                      setIsRentalAverage(true);
                    }}
                    disabled={rentalAverage !== null && isRentalAverage}
                    className="text-md px-6 py-2 bg-green-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-green-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-no-drop"
                  >
                    Get Rent Avg
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse mt-6">
          <button
            onClick={onClose}
            className="text-md px-4 py-2 bg-gray-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-gray-700 focus:outline-none "
          >
            Close
          </button>
          <button
            onClick={() =>
              onSubmit({
                apartment_id: listItem?.id || 0,
                lat: center ? center[0] : listItem?.lat || 0,
                lng: center ? center[1] : listItem?.lng || 0,
                discount: discount || 0,
                renovation,
                new_rent: newRent || listItem?.average_rental || 0,
                is_qualified: false,
                date_created: new Date(),
                coordinatesChange: center ? true : false,
              })
            }
            className="text-md mr-6 px-4 py-2 bg-blue-500 font-semibold text-white rounded-md transition-all duration-300 transform hover:bg-blue-700 focus:outline-none "
          >
            Create
          </button>
        </div>
      </>
    </Modal>
  );
};

export default CalcOpportunityModal;
