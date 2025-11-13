import { NavLink, useLocation } from "react-router-dom";
import { ActionIcon, Button, em, Flex, Stack, Tooltip } from "@mantine/core";
import classes from "./classes/NavBarNested.module.css";
import navbarLinks from "./navbarLinks";
import { LinksGroup } from "./components/NavBarLinksGroup";
import { useMediaQuery } from "@mantine/hooks";
import { useLogout } from "../../features/auth/model/lib/hooks/useLogout";

type Props = { expanded: boolean };

export default function NavbarNested({ expanded }: Props) {
  const { logout } = useLogout();
  const location = useLocation();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  if (!expanded) {
    // только иконки
    return (
      <nav className={classes.railRoot}>
        <Stack gap={8} align="center" justify="start">
          {navbarLinks.map((item) => {
            const active = item.link && location.pathname === item.link;
            return (
              <Tooltip
                key={item.label}
                label={item.label}
                position="right"
                withArrow
              >
                <ActionIcon
                  component={NavLink as any}
                  to={item.link ?? "#"}
                  size="lg"
                  radius="md"
                  variant={active ? "filled" : "transparent"}
                  className={classes.railIcon}
                  aria-label={item.label}
                  color={active ? "var(--main-color)" : "black"}
                >
                  {item.icon}
                </ActionIcon>
              </Tooltip>
            );
          })}
        </Stack>
      </nav>
    );
  }

  // развернуто: текстовые пункты/группы
  return (
    <nav className={classes.navbar}>
      <Flex justify="space-between" h="100%" direction="column" p={16}>
        <Stack h="100%" className={classes.linksInner}>
          {navbarLinks.map((item) => (
            <LinksGroup {...item} key={item.label} />
          ))}
        </Stack>
        {isMobile && (
          <Button
            onClick={logout}
            style={{ justifySelf: "end" }}
            color="red"
            variant="outline"
          >
            Выйти из аккаунта
          </Button>
        )}
      </Flex>
      <div className={classes.footer} />
    </nav>
  );
}
