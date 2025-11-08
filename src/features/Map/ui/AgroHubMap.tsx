import { useEffect } from "react";
//import { MapContainer, TileLayer } from 'react-leaflet';

//@ts-ignore
import L from "leaflet";

//TODO: Import to main
import "leaflet/dist/leaflet.css";

export const AgroHubMap = () => {
  useEffect(() => {
    console.log("CHECK");

    const map = L.map("map").setView([55.751244, 37.618423], 8);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // const qgisLayer = L.tileLayer.wms('http://localhost:3003/?', {
    //     layers: 'osm',
    //     format: 'image/png',
    //     transparent: true,
    //     version: '1.3.0',
    // });

    // qgisLayer.addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "500px", width: "600px" }} />;
};
