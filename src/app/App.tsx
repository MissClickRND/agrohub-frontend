import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Router } from "./providers/Router";
import { theme } from "./theme";
import { Notifications } from "@mantine/notifications";

export default function App() {
  return (
    // Закреплена только светлая тема
    <MantineProvider theme={theme} forceColorScheme="light">
      <Notifications />
      <Router />
    </MantineProvider>
  );
}
