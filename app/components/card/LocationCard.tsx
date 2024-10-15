import {
  convertSecondsToMinutes,
  getLocationTitle,
  getWalkDistance,
} from "../../utils/market";
import { Translator } from "../../data/language/translator";
import { roundNumberToDecimal } from "../../utils/numbers";
import { AdPlace } from "../../types/market.types";
import { LangType } from "../../types/dashboard.types";

const LocationCard = ({
  lang,
  adPlace,
  adLat,
  adLng,
}: {
  lang: LangType;
  adPlace: AdPlace;
  adLat: number;
  adLng: number;
}) => {
  const translate = new Translator("market");
  const walk = getWalkDistance(
    [adLat, adLng],
    [adPlace.place_id.lat!, adPlace.place_id.lng!]
  );

  return (
    <div key={adPlace.id} className="mb-1 lg:mb-2">
      <p className="text-md font-semibold">
        {translate.getTranslation(
          lang,
          getLocationTitle(adPlace.place_id.type)
        )}
      </p>
      <p className="text-sm font-regular">
        <span className="inline-block align-bottom mr-2">
          <svg
            className="w-[20px] h-[20px] fill-blue-300"
            viewBox="0 0 640 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zM434.7 368a48 48 0 1 1 90.5 32 48 48 0 1 1 -90.5-32zM160 336a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
          </svg>
        </span>
        {`${roundNumberToDecimal(
          adPlace.distance / 1000,
          2
        )}km, ${convertSecondsToMinutes(
          adPlace.duration
        )} ${translate.getTranslation(
          lang,
          "minutes"
        )} ${translate.getTranslation(lang, "drive")}`}
      </p>
      <p className="text-sm font-regular">
        <span className="inline-block align-bottom mr-2">
          <svg
            className="w-[20px] h-[20px] fill-teal-400"
            viewBox="0 0 320 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M160 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM126.5 199.3c-1 .4-1.9 .8-2.9 1.2l-8 3.5c-16.4 7.3-29 21.2-34.7 38.2l-2.6 7.8c-5.6 16.8-23.7 25.8-40.5 20.2s-25.8-23.7-20.2-40.5l2.6-7.8c11.4-34.1 36.6-61.9 69.4-76.5l8-3.5c20.8-9.2 43.3-14 66.1-14c44.6 0 84.8 26.8 101.9 67.9L281 232.7l21.4 10.7c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L247 287.3c-10.3-5.2-18.4-13.8-22.8-24.5l-9.6-23-19.3 65.5 49.5 54c5.4 5.9 9.2 13 11.2 20.8l23 92.1c4.3 17.1-6.1 34.5-23.3 38.8s-34.5-6.1-38.8-23.3l-22-88.1-70.7-77.1c-14.8-16.1-20.3-38.6-14.7-59.7l16.9-63.5zM68.7 398l25-62.4c2.1 3 4.5 5.8 7 8.6l40.7 44.4-14.5 36.2c-2.4 6-6 11.5-10.6 16.1L54.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L68.7 398z"></path>
          </svg>
        </span>
        {`${walk.distance}km, ${walk.duration} ${translate.getTranslation(
          lang,
          "minutes"
        )} ${translate.getTranslation(lang, "walk")}`}
      </p>
    </div>
  );
};

export default LocationCard;
