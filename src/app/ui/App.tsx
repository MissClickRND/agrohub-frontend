import "@mantine/core/styles.css";
import {MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {theme} from "../providers/theme/theme";
import {Router} from "../providers/router/Router";
import MapPage from "../../features/debug/pages/MapPage.tsx";
import React from "react";

export default function App() {
    return (
        // Закреплена только светлая тема
        <MantineProvider theme={theme} forceColorScheme="light">
            <Notifications/>
            <MapPage/>
            {/*<Router/>*/}
        </MantineProvider>
    );
}
