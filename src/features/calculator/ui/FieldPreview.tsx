import { Autocomplete, Flex, Loader, Stack, Text } from "@mantine/core";
import { MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";
import { useCalculator } from "../model/lib/hooks/useCalculator";

const converCoords = (coords: [number, number][][]): [number, number][][] =>
  coords.map((ring) => ring.map(([lng, lat]) => [lat, lng]));

export const FieldPreview = () => {
  const {fieldChangeHandler, selectedCultures, setCultureHandler, fields, isLoading, cultures, selectedField, selectedZone, setSelectedZone} = useCalculator()
  return (
    <Stack>
      <Autocomplete
        data={fields?.map((field) => field.name)}
        onChange={fieldChangeHandler}
        label="Выберите поле"
      />
      {selectedField && (
        <Stack>
          <MapContainer
            style={{ height: "500px", zIndex: 1, position: "relative" }}
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
                {isLoading ? (
                  <Loader />
                ) : (
                  <Autocomplete
                    comboboxProps={{ withinPortal: false }}
                    w={"100px"}
                    onChange={setCultureHandler}
                    data={cultures.map((cul) => String(cul.name))}
                  />
                )}
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
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <Autocomplete
                      comboboxProps={{ withinPortal: false }}
                      w={"100px"}
                      onChange={(value) => setCultureHandler(value, String(zone.id))}
                      data={cultures.map((cul) => String(cul.name))}
                    />
                  )}
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
                          {selectedCultures[key === "main" ? key : Number(key)].name}
                        </Text>
                      </Flex>
                      <Text>
                        {Math.round(
                          (key === "main"
                            ? selectedField.area!
                            : selectedField.zones!.find(
                                (zone) => zone.id === Number(key)
                              )!.area!
                         )/ 100) / 100}{" "}
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
