import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { useEffect } from "react";
import { useUserInfo } from "../../features/auth/model/lib/hooks/useUserInfo";
import { NavbarNested } from "../../widgets/NavBarNested/NavBarNested.tsx";
import AnimationLayout from "../AnimatedLayout/AnimatedLayout.tsx";
import Header from "../../widgets/Header/Header.tsx";

export default function MainLayout() {
  const { userInfo } = useUserInfo();

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <>
      <AppShell
        h={"100%"}
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: false,
        }}
      >
        <AppShell.Header>
          <Header />
        </AppShell.Header>

        <AppShell.Navbar>
          <NavbarNested show={true} />
        </AppShell.Navbar>

        <AppShell.Main h={"100%"}>
          {/*@ts-ignore*/}
          <AnimationLayout>
            <Outlet />
          </AnimationLayout>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
