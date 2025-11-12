import { Box } from "@mantine/core";
import Dashboards from "./components/Dashboards";
import DashboardHeader from "./components/DashboardHeader";

export default function Main() {
  return (
    <>
      <DashboardHeader />
      <Box w="100%" p={16}>
        <Dashboards />
      </Box>
    </>
  );
}
