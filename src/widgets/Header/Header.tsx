import {
  ActionIcon,
  Box,
  Burger,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import AgrohubSpotlightButton from "./components/AgrohubSpotlightButton.tsx";
import AgrohubSpotlight from "./components/AgrohubSpotlight.tsx";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { useMeStore } from "../../entities/me/model/meStore.tsx";
import ModalAcceptAction from "../ModalAcceptAction/ModalAcceptAction.tsx";
import { useDisclosure } from "@mantine/hooks";
import { useLogout } from "../../features/auth/model/lib/hooks/useLogout.ts";

type Props = {
  burgerOpened: boolean;
  burgerToggle: () => void;
};

function Header({ burgerOpened, burgerToggle }: Props) {
  const { logout } = useLogout();
  const [opened, { open, close }] = useDisclosure(false);
  const { userName } = useMeStore();
  const theme = useMantineTheme();

  return (
    <>
      <ModalAcceptAction
        onPass={logout}
        opened={opened}
        close={close}
        text="Вы уверены что хотите выйти?"
      />
      <Stack p={20} justify={"center"} h={"100%"}>
        <Group align={"center"} justify={"space-between"}>
          <Group align={"center"}>
            <Group gap={6} px={4}>
              <img src="/icons/MainLogo.svg" style={{ height: "36px" }} />
              {/* <Text fw={600}>АгроХаб</Text> */}
            </Group>
          </Group>
          <Box visibleFrom={"sm"}>
            <AgrohubSpotlightButton onClick={spotlight.open} />
          </Box>
          <Box>
            <Group gap={10}>
              {/* <Box
                visibleFrom={"sm"}
                pr={10}
                h={36}
                bd={`1px solid ${theme.colors.primary[4]}`}
                bdrs={8}
              >
                <Group gap={5}>
                  <IconUser size={33} color={theme.colors.primary[4]} />
                  <Text fz={15} fw={600}>
                    {userName}
                  </Text>
                </Group>
              </Box> */}

              <ActionIcon
                color={"red"}
                onClick={open}
                visibleFrom={"sm"}
                variant={"outline"}
                size={36}
                radius={8}
              >
                <IconLogout />
              </ActionIcon>
            </Group>
            <Burger
              lineSize={1}
              size={22}
              opened={burgerOpened}
              onClick={burgerToggle}
              hiddenFrom="sm"
            />
          </Box>
        </Group>
      </Stack>
      <AgrohubSpotlight />
    </>
  );
}

export default Header;
