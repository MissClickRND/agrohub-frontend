import { Outlet } from "react-router-dom";
import NavLayout from "./components/NavLayout";
import { Box } from "@mantine/core";
import { useEffect } from "react";
import { useUserInfo } from "../../features/auth/model/lib/hooks/useUserInfo";

export default function MainLayout() {
  const { userInfo } = useUserInfo();

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <>
      <NavLayout />
      <Box p={20} bg="var(--white-gray)">
        <Outlet />
      </Box>
    </>
  );
}
