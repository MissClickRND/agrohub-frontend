import { Outlet } from "react-router-dom";
import { AppShell, em } from "@mantine/core";
import { useEffect } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useUserInfo } from "../../features/auth/model/lib/hooks/useUserInfo";
import AnimationLayout from "../AnimatedLayout/AnimatedLayout";
import Header from "../../widgets/Header/Header";
import ExpandableNavbar from "../../widgets/NavBarNested/ExpandableNavbar";

const HEADER_HEIGHT = 60;
const NAV_COLLAPSED = 84;
const NAV_EXPANDED = 300;

export default function MainLayout() {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
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
      navbar={{ width: isMobile ? 0 : NAV_COLLAPSED }}
    >
      <AppShell.Header>
        <Header burgerOpened={burgerOpened} burgerToggle={burgerToggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <ExpandableNavbar
          headerHeight={HEADER_HEIGHT}
          collapsedWidth={isMobile ? 0 : NAV_COLLAPSED}
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
