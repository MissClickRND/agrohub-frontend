import {useState} from 'react';
import {IconChevronRight} from '@tabler/icons-react';
import {
    Box,
    Collapse,
    Group,
    Stack,
    Text,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core';
import NavBarButton from './NavBarButton/NavBarButton.tsx';
import {useNavigate} from 'react-router';
import {useLocation} from 'react-router-dom';
import * as React from 'react';

interface LinksGroupProps {
    icon: React.ReactNode;
    label: string;
    link: string | undefined;
    initiallyOpened?: boolean;
    links?: { label: string; link: string }[];
}

export function LinksGroup({
                               icon,
                               label,
                               link,
                               initiallyOpened,
                               links,
                           }: LinksGroupProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const hasLinks = Array.isArray(links);

    const [opened, setOpened] = useState(initiallyOpened || false);

    const isSelected = !!link && location.pathname.indexOf(link) != -1;

    const items = (hasLinks ? links : []).map((link) => {
        const subLinksIsSelected = location.pathname.indexOf(link.link) != -1;


        return (
            <UnstyledButton
                key={link.label}
                bg={subLinksIsSelected ? 'primary' : 'gray.0'}
                c={'darkgray.1'}
                bdrs={8}
                py={9}
                //TODO: this need calculate from icon size and spacing between icon and lables
                pl={32}
                onClick={() => {
                    console.log(link);
                    navigate(link.link);
                }}
            >
                <Text<'a'> fw={600} fz={13} ml={15}>
                    {link.label}
                </Text>
            </UnstyledButton>
        );
    });

    return (
        <>
            <NavBarButton
                onClick={() => {
                    if (!hasLinks && link) {
                        navigate(link);
                    } else {
                        setOpened((o) => !o);
                    }
                }}
                isSelected={isSelected}
            >
                <Group justify="space-between" px={12} gap={0}>
                    <Box py={9} style={{display: 'flex', alignItems: 'center'}}>
                        {/*@ts-ignore*/}
                        {React.cloneElement(icon)}
                        <Box ml="md">
                            <Text fw={600} fz={13}>
                                {label}
                            </Text>
                        </Box>
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            stroke={3}
                            size={16}
                            style={{transform: opened ? 'rotate(90deg)' : 'rotate(0deg)'}}
                        />
                    )}
                </Group>
            </NavBarButton>
            {hasLinks ? (
                <Collapse in={opened}>
                    <Stack>{items}</Stack>
                </Collapse>
            ) : null}
        </>
    );
}
