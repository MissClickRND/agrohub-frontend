import { Outlet } from "react-router-dom";
import NavLayout from "./components/NavLayout";
import { Box } from "@mantine/core";

export default function MainLayout() {
  return (
    <>
      <NavLayout />
      <Box p={20} bg="var(--white-gray)">
        <Outlet />
      </Box>
    </>
  );
}
