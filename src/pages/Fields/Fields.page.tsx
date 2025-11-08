import { useState } from "react";
import { Flex, Paper } from "@mantine/core";
import FieldManagement from "./components/FieldManagement";
import FieldViewer from "./components/FieldViewer";
import { Field } from "../../features/Map/model/types";

const Fields = () => {
  const [userFields, setUserFields] = useState<Field[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

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
  ];

  const allFields = [...initialData, ...userFields];

  return (
    <Paper bg="white" bdrs={16} p={20}>
      <Flex gap={20}>
        <FieldManagement
          onAddField={() => setIsDrawing(true)}
          data={allFields}
        />
        <FieldViewer
          data={allFields}
          isDrawing={isDrawing}
          onDrawingComplete={(newField) => {
            setUserFields((prev) => [...prev, newField]);
            setIsDrawing(false);
          }}
          onCancelDrawing={() => setIsDrawing(false)}
        />
      </Flex>
    </Paper>
  );
};

export default Fields;
