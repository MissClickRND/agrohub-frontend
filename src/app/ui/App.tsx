import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "../providers/theme/theme";
import { Router } from "../providers/router/Router";
import { QueryProvider } from "../providers/tanstack/QueryProvider";

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
