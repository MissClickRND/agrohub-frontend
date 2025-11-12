import { Autocomplete, Flex, Stack, Text } from "@mantine/core";
import { useGetFields } from "../../Map/model/lib/hooks/useGetFields";
import { useState } from "react";
import { MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";
import { Field, Zone } from "../../Map/model/types";

const cultures = ["wheat", "corn", "beans"];

const converCoords = (coords: [number, number][][]): [number, number][][] =>
  coords.map((ring) => ring.map(([lng, lat]) => [lat, lng]));

export const FieldPreview = () => {
  const { fields } = useGetFields();
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | Field | null>(null);
  const [selectedCultures, setSelectedCultures] = useState<Record<
    number | string,
    string
  > | null>(null);
  return (
    <Stack>
      <Text fz={"h4"}>Выберите поле</Text>
      <Autocomplete
        data={fields?.map((field) => field.name)}
        onChange={(value) => {
          const newField = fields?.find((field) => field.name === value);
          console.log(newField, value);
          setSelectedField(newField ?? null);
          setSelectedZone(null);
          setSelectedCultures(null);
        }}
      />
      {selectedField && (
        <Stack>
          <MapContainer
            style={{ height: "500px" }}
            zoom={13}
            center={
              converCoords(selectedField.geometry.coordinates)[0][0] as [
                number,
                number
              ]
            }
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polygon
              pathOptions={{
                color:
                  selectedZone?.id === selectedField.id
                    ? "white"
                    : selectedField.color,
              }}
              positions={converCoords(selectedField.geometry.coordinates)[0]}
              eventHandlers={{
                click() {
                  setSelectedZone(selectedField);
                },
              }}
            >
              <Popup>
                <Autocomplete
                  comboboxProps={{ withinPortal: false }}
                  w={"100px"}
                  onChange={(value) => {
                    if (cultures.includes(value) || value === "")
                      setSelectedCultures({
                        ...selectedCultures,
                        main: value,
                      });
                  }}
                  data={cultures}
                />
              </Popup>
            </Polygon>
            {selectedField.zones?.map((zone) => (
              <Polygon
                eventHandlers={{
                  click() {
                    setSelectedZone(zone);
                  },
                }}
                color={selectedZone?.id === zone.id ? "green" : zone.color}
                pathOptions={{
                  color: selectedZone?.id === zone.id ? "white" : zone.color,
                }}
                positions={converCoords(zone.geometry.coordinates)[0]}
              >
                <Popup>
                  <Autocomplete
                    comboboxProps={{ withinPortal: false }}
                    w={"100px"}
                    onChange={(value) => {
                      if (cultures.includes(value) || value === "")
                        setSelectedCultures({
                          ...selectedCultures,
                          [zone.id!]: value,
                        });
                    }}
                    data={cultures}
                  />
                </Popup>
              </Polygon>
            ))}
          </MapContainer>
          {selectedCultures && (
            <>
              <Text fz={"h4"} fw={"bold"}>
                Выбранные культуры
              </Text>
              {Object.keys(selectedCultures).map((key) => (
                <Flex justify={"space-between"} gap={"1rem"}>
                  {selectedCultures[key === "main" ? key : Number(key)] && (
                    <>
                      <Flex gap={"1rem"}>
                        <Text>
                          {key === "main"
                            ? "Основное поле:"
                            : "Зона номер " + key + ":"}
                        </Text>
                        <Text>
                          {selectedCultures[key === "main" ? key : Number(key)]}
                        </Text>
                      </Flex>
                      <Text>
                        {Math.round(
                          key === "main"
                            ? selectedField.area!
                            : selectedField.zones!.find(
                                (zone) => zone.id === Number(key)
                              )!.area!
                        ) / 10000}{" "}
                        Га
                      </Text>
                    </>
                  )}
                </Flex>
              ))}
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
};
