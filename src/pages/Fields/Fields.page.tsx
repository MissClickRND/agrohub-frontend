import { useState } from "react";
import { Flex, Paper } from "@mantine/core";
import FieldManagement from "./components/FieldManagement";
import FieldViewer from "./components/FieldViewer";
import { Field } from "../../features/Map/model/types";
const initialData: Field[] = [
  {
    id: 1,
    color: "#ff00dd",
    name: "TEST",
    geometry: [
      [
        [38.788322, 56.229001],
        [39.128946, 55.873154],
        [40.249708, 56.079087],
        [39.447594, 56.626927],
        [38.788322, 56.229001],
      ],
    ],
    zone: 1,
    soil: "Чернозем",
    square: 18,
  },
  {
    id: 2,
    color: "#ff00dd",
    name: "TEST2",
    geometry: [
      [
        [30.509621, 59.818866],
        [30.817281, 59.33487],
        [32.355582, 59.552695],
        [30.509621, 59.818866],
      ],
    ],
    zone: 1,
    soil: "Чернозем",
    square: 24,
  },
];
const Fields = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<number | undefined>(
    undefined
  );

  const [data, setData] = useState<Field[]>(initialData);

  return (
    <Paper bg="white" bdrs={16} p={20}>
      <Flex gap={20}>
        <FieldManagement
          onAddField={() => setIsDrawing(true)}
          data={data}
          onFieldSelect={setSelectedFieldId}
          selectedFieldId={selectedFieldId}
        />
        <FieldViewer
          data={data}
          isDrawing={isDrawing}
          onDrawingComplete={async (newField) => {
            setIsDrawing(false);
          }} // потом перерендер
          onCancelDrawing={() => setIsDrawing(false)}
          selectedFieldId={selectedFieldId}
        />
      </Flex>
    </Paper>
  );
};

export default Fields;
