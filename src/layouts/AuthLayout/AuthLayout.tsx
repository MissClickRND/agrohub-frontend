import { Center, Flex, Paper, Image } from "@mantine/core";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Center w="100vw" h="100vh" bg="var(--white-gray)">
      <Paper bg="white" bdrs={16} p={19}>
        <Flex>
          <Image visibleFrom="md" w={500} bdrs={8} src="/img/AuthPhoto.jpg" />
          <Flex direction="column" justify="center" px={{ base: 10, md: 62 }}>
            <Outlet />
          </Flex>
        </Flex>
      </Paper>
    </Center>
  );
}
