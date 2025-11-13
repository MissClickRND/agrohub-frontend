import { Box, Stack, Text, Image, Center } from "@mantine/core";
import LoginForm from "../../../features/auth/ui/LoginForm";

export default function Login() {
  return (
    <Stack>
      <Center>
        <Image src="/icons/MainLogo.svg" mb={80} w={300} />
      </Center>
      <Box>
        <Text fz={24} fw={700}>
          Вход в аккаунт
        </Text>
        <Text fz={13} c="var(--subtitle)">
          Авторизуйтесь, чтобы продолжить
        </Text>
      </Box>
      <LoginForm />
    </Stack>
  );
}
