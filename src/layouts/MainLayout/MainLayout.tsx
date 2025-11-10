import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useUserInfo } from "../../features/auth/model/lib/hooks/useUserInfo";
import AnimationLayout from "../AnimatedLayout/AnimatedLayout";
import Header from "../../widgets/Header/Header";
import ExpandableNavbar from "../../widgets/NavBarNested/ExpandableNavbar";

const HEADER_HEIGHT = 60;
const NAV_COLLAPSED = 84; // ширина рейла с иконками
const NAV_EXPANDED = 300; // ширина раскрытого меню на десктопе

export default function MainLayout() {
  const { userInfo } = useUserInfo();
  const [burgerOpened, { toggle: burgerToggle, close: burgerClose }] =
    useDisclosure(false);

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <AppShell
      h="100%"
      header={{ height: HEADER_HEIGHT }}
      // @ts-ignore
      navbar={{ width: NAV_COLLAPSED, breakpoint: "sm", collapsed: false }}
    >
      <AppShell.Header>
        <Header burgerOpened={burgerOpened} burgerToggle={burgerToggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <ExpandableNavbar
          headerHeight={HEADER_HEIGHT}
          collapsedWidth={NAV_COLLAPSED}
          expandedWidth={NAV_EXPANDED}
          burgerOpened={burgerOpened}
          onCloseMobile={burgerClose}
        />
      </AppShell.Navbar>

      <AppShell.Main h="100%">
        {/*@ts-ignore*/}
        <AnimationLayout>
          <Outlet />
        </AnimationLayout>
      </AppShell.Main>
    </AppShell>
  );
}
