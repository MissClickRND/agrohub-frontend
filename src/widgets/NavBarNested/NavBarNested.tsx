import {ScrollArea, Stack, Text} from '@mantine/core';
import classes from './NavBarNested.module.css';
import {LinksGroup} from './components/NavBarLinksGroup.tsx';
import navbarLinks from "./navbarLinks.tsx";

type Props = {
    show: boolean;
};

export function NavbarNested({show}: Props) {
    const links = navbarLinks.map((item) => (
        <LinksGroup {...item} key={item.label}/>
    ));

    return show ? (
        <nav className={classes.navbar}>
            <div className={classes.header}>
                <Text fw={500} fz={18}>
                    Навигация
                </Text>
            </div>

            <ScrollArea className={classes.links}>
                <Stack px={20}>{links}</Stack>
            </ScrollArea>

            <div className={classes.footer}></div>
        </nav>
    ) : null;
}
