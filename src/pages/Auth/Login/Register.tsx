import { Box, Stack, Text, Image, Center } from "@mantine/core";
import RegisterForm from "../../../features/auth/ui/RegisterForm";

export default function Register() {
  return (
    <Stack>
      <Center>
        <Image src="/icons/MainLogo.svg" mb={30} w={300} />
      </Center>
      <Box>
        <Text fz={24} fw={700}>
          Создайте аккаунт
        </Text>
        <Text fz={13} c="var(--subtitle)">
          Введите свои данные что бы продолжить
        </Text>
      </Box>
      <RegisterForm />
    </Stack>
  );
}
