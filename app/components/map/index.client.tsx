import { CircleMarker, LatLng, LatLngTuple } from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
} from "react-leaflet";

function LocationMarker({
  range,
  setCenter,
}: {
  range: number;
  setCenter: (val: number[]) => void;
}) {
  const [position, setPosition] = useState<LatLng>();
  const circleRefs = useRef<CircleMarker>();

  const [radius, setRadius] = useState<number>();
  const rangeFocusMap: Record<number, number> = {
    250: 16,
    500: 15,
    1000: 14,
    1500: 13,
    2000: 13,
  };
  const map = useMapEvents({
    click(event) {
      setPosition(event.latlng);
      setCenter([event.latlng.lat, event.latlng.lng]);
      map.setView(event.latlng, rangeFocusMap[range], { animate: true });
    },
    zoom() {
      setRadius(range);
    },
  });

  useEffect(() => {
    if (position && circleRefs.current) {
      circleRefs.current.setRadius(range);
      map.setZoom(rangeFocusMap[range]);
    }
  }, [range]);

  return position === undefined ? null : (
    <>
      {" "}
      {radius && (
        <Circle
          center={position!}
          radius={radius}
          ref={(ref) => {
            circleRefs.current = ref as CircleMarker;
          }}
        />
      )}
      <Marker position={position!}>
        <Popup>Location of you interest</Popup>
      </Marker>
    </>
  );
}

const Map = ({
  range,
  setCenter,
}: {
  range: number;
  setCenter: (val: number[]) => void;
}) => {
  const position: LatLngTuple = [44.8064, 20.4828];
  return (
    <div className="h-[400px] w-full" id="mapContainer">
      <MapContainer
        style={{
          height: "100%",
        }}
        center={position}
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker range={range} setCenter={setCenter} />
      </MapContainer>
    </div>
  );
};

export default Map;
