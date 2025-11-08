import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "../providers/theme/theme";
import { Router } from "../providers/router/Router";

export default function App() {
  return (
    // Закреплена только светлая тема
    <MantineProvider theme={theme} forceColorScheme="light">
      <Notifications />
      <Router />
    </MantineProvider>
  );
}
