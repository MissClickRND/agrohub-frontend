import { Flex, Paper } from "@mantine/core";

import FieldManagement from "./components/FieldManagement.tsx";
import FieldViewer from "./components/FieldViewer.tsx";

const Fields = () => {
  const data = [
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

  return (
    <Paper bg="white" bdrs={16} p={20}>
      <Flex gap={20}>
        <FieldManagement data={data} />
        <FieldViewer data={data} />
      </Flex>
    </Paper>
  );
};

export default Fields;
