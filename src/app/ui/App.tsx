import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/spotlight/styles.css";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "../api/providers/theme/theme";
import { Router } from "../api/providers/router/Router";
import { QueryProvider } from "../api/providers/tanstack/QueryProvider";

export default function App() {
  return (
    // Закреплена только светлая тема
    <QueryProvider>
      <MantineProvider theme={theme} forceColorScheme="light">
        <Notifications />
        <Router />
      </MantineProvider>
    </QueryProvider>
  );
}
