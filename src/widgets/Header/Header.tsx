import {
    ActionIcon,
    Box,
    Burger, Button,
    Group,
    Stack,
    Text,
    useMantineTheme,
    useMatches,
} from "@mantine/core";
import {spotlight} from "@mantine/spotlight";
import IconNotification from "../../../../ask-resurs/frontend/ask-resurs-cms/src/icons/IconNotification.tsx";
import IconExit from "../../../../ask-resurs/frontend/ask-resurs-cms/src/icons/IconExit.tsx";
import IconPerson from "../../../../ask-resurs/frontend/ask-resurs-cms/src/icons/IconPerson.tsx";
import {useDisclosure} from "@mantine/hooks";
import LogoutDialog from "../../../../ask-resurs/frontend/ask-resurs-cms/src/components/dialogs/LogoutDialog.tsx";
import AgrohubSpotlightButton from "./components/AgrohubSpotlightButton.tsx";
import AgrohubSpotlight from "./components/AgrohubSpotlight.tsx";

type Props = {
    burgerOpened: boolean;
    burgerToggle: () => void;
};

function Header({burgerOpened, burgerToggle}: Props) {
    const theme = useMantineTheme();

    const rightPartGap = useMatches({
        sm: 5,
        md: 20,
    });

    const [
        logoutModalOpened,
        {open: openLogoutModal, close: closeLogoutModal},
    ] = useDisclosure(false);

    return (
        <>
            <Stack p={20} justify={"center"} h={"100%"}>
                <Group align={"center"} justify={"space-between"}>
                    <Box>
                        <Group align={"center"} align={"center"}>
                            <Burger
                                lineSize={1}
                                size={16}
                                opened={burgerOpened}
                                onClick={burgerToggle}
                            />
                            <Box visibleFrom={"sm"}>
                                <AgrohubSpotlightButton onClick={spotlight.open}/>
                            </Box>
                        </Group>
                    </Box>

                    <Box>
                        <Group gap={rightPartGap}>
                            {/*<ActionIcon variant={"transparent"}>*/}
                            {/*    <IconNotification size={16} fill={theme.colors.primary[0]}/>*/}
                            {/*</ActionIcon>*/}
                            {/*<ActionIcon hiddenFrom={"sm"} variant={"transparent"}>*/}
                            {/*    <IconExit size={13} fill={theme.primaryColor}/>*/}
                            {/*</ActionIcon>*/}

                            <Box visibleFrom={"sm"}>
                                <Group gap={5}>
                                    <IconPerson size={32} fill={theme.colors.primary[4]}/>
                                    <Text fz={15} fw={600}>
                                        account
                                    </Text>
                                </Group>
                            </Box>

                            <Button
                                color={"red"}
                                onClick={() => {
                                    openLogoutModal();
                                }}
                                visibleFrom={"sm"}
                                variant={"outline"}
                            >
                                Выйти
                            </Button>
                        </Group>
                    </Box>
                </Group>
            </Stack>
            <AgrohubSpotlight/>
            <LogoutDialog
                opened={logoutModalOpened}
                onClose={closeLogoutModal}
                onCancel={() => {
                    closeLogoutModal();
                }}
                onConfirm={() => {
                    //logout();
                }}
            />
        </>
    );
}

export default Header;
