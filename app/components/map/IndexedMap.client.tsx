import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const IndexedMap = ({
  position,
  popText,
}: {
  position: LatLngExpression;
  popText: string;
}) => {
  return (
    <div className="h-[250px] md:h-[330px] w-full" id="mapContainer">
      <MapContainer
        style={{
          height: "100%",
        }}
        center={position}
        zoom={15}
        attributionControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position!}>
          <Popup>{popText}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default IndexedMap;
