import { OpportunityListItem } from "../../types/dashboard.types";
import { makeNumberCurrency } from "../../utils/numbers";
import {
  truncateString,
  getFullPrice,
  getFurnitureCost,
  getRentROI,
  highlightRoi,
  getRentRevenueM2Yearly,
  getRentRevenueM2,
  getRentRevenue,
  getRentAmortization,
  getRentFee,
  getRentTax,
  getRentNet,
  getRentGross,
  getPurchaseFee,
  highlightRentGross,
  highlightPriceM2,
  getM2Price,
  getRenovationType,
} from "../../utils/opportunity";

export const TableHeader = ({ short = false }: { short?: boolean }) => {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-4 py-3">
          Name
        </th>
        <th scope="col" className="px-4 py-3">
          ID
        </th>
        <th scope="col" className="px-4 py-3">
          City Part
        </th>
        <th scope="col" className="px-4 py-3">
          Size
        </th>
        <th scope="col" className="px-4 py-3">
          Price
        </th>
        <th scope="col" className="px-4 py-3">
          Furnish
        </th>
        <th scope="col" className="px-4 py-3">
          Fee
        </th>
        <th scope="col" className="px-4 py-3">
          Price m2
        </th>
        <th scope="col" className="px-4 py-3">
          Rent m2
        </th>
        <th scope="col" className="px-4 py-3">
          Rent gros
        </th>
        <th scope="col" className="px-4 py-3">
          Rent net
        </th>
        <th scope="col" className="px-4 py-3">
          Rent tax
        </th>
        <th scope="col" className="px-4 py-3">
          Rent fee
        </th>
        <th scope="col" className="px-4 py-3">
          Rent amort
        </th>
        <th scope="col" className="px-4 py-3">
          Revenue
        </th>
        <th scope="col" className="px-4 py-3">
          Revenue m2
        </th>
        <th scope="col" className="px-4 py-3">
          Y revenue m2
        </th>
        <th scope="col" className="px-4 py-3">
          Y ROI
        </th>
        <th scope="col" className="px-4 py-3">
          DATE
        </th>
        {!short && (
          <>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Link</span>
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Calc</span>
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </>
        )}
      </tr>
    </thead>
  );
};

export const TableRow = ({
  item,
  onCalc,
  short = false,
}: {
  item: OpportunityListItem;
  onCalc: () => void;
  short?: boolean;
}) => {
  return (
    <tr
      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      key={item.id}
    >
      <th
        scope="row"
        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        title={item.name}
      >
        {truncateString(item.name)}
      </th>
      <td className="px-4 py-3">{item.id}</td>
      <td className="px-4 py-3">{item.city_part}</td>
      <td className="px-4 py-3">{item.size}</td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getFullPrice(item.price, item.description))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(
          getFurnitureCost(item.size, getRenovationType(item.description))
        )}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(
          getPurchaseFee(item.price, item.description, item.size)
        )}
      </td>
      <td
        className={`px-4 py-3 ${highlightPriceM2(
          item.price,
          item.description,
          item.size
        )}`}
      >
        {makeNumberCurrency(
          getM2Price(item.price, item.description, item.size)
        )}
      </td>
      <td className="px-4 py-3">{makeNumberCurrency(item.average_rental)}</td>
      <td
        className={`px-4 py-3 ${highlightRentGross(
          item.average_rental,
          item.size
        )}`}
      >
        {makeNumberCurrency(getRentGross(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentNet(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentTax(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentFee(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(
          getRentAmortization(item.average_rental, item.size)
        )}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentRevenue(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(getRentRevenueM2(item.average_rental, item.size))}
      </td>
      <td className="px-4 py-3">
        {makeNumberCurrency(
          getRentRevenueM2Yearly(item.average_rental, item.size)
        )}
      </td>
      <td
        className={`px-4 py-3 ${highlightRoi(
          item.average_rental,
          item.price,
          item.description,
          item.size
        )}`}
      >
        {getRentROI(
          item.average_rental,
          item.price,
          item.description,
          item.size
        )}
      </td>
      <td className="px-4 py-3">{`${item.date_created}`}</td>
      {!short && (
        <>
          <td className="px-4 py-3 text-right">
            <a
              href={`https://www.nekretnine.rs${item.link}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Link
            </a>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              onClick={onCalc}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Calc
            </button>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              onClick={() => console.log("click")}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Edit
            </button>
          </td>
        </>
      )}
    </tr>
  );
};
