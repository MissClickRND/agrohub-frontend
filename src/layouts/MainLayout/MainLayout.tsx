import {Outlet} from "react-router-dom";
import NavLayout from "./components/NavLayout";
import {AppShell, Box} from "@mantine/core";
import {useEffect} from "react";
import {useUserInfo} from "../../features/auth/model/lib/hooks/useUserInfo";
import {NavbarNested} from "../../widgets/NavBarNested/NavBarNested.tsx";

export default function MainLayout() {
    const {userInfo} = useUserInfo();

    useEffect(() => {
        userInfo();
    }, []);

    return (
        <>
            <AppShell
                h={"100%"}
                header={{height: 60}}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: false,
                }}
            >
                <AppShell.Header>
                    <div>Logo</div>
                </AppShell.Header>

                <AppShell.Navbar><NavbarNested show={true}/></AppShell.Navbar>

                <AppShell.Main h={"100%"}><Outlet/></AppShell.Main>
            </AppShell>
        </>
    );
}
