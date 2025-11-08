import { Flex, Paper } from "@mantine/core";

import FieldManagment from "./components/FieldManagment.tsx";
import FieldViewer from "./components/FieldViewer.tsx";

const Fields = () => {
  return (
    <Paper bg="white" bdrs={16} p={20}>
      <Flex gap={20} h={500}>
        <FieldManagment />
        <FieldViewer />
      </Flex>
    </Paper>
  );
};

export default Fields;
