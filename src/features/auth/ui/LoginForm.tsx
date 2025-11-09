import { Button, Flex, Input, PasswordInput, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NavLink } from "react-router-dom";
import { useLogin } from "../model/lib/hooks/useLogin";

const LoginForm = () => {
  const { isLoading, login } = useLogin();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length >= 3 ? null : "Логин слишком короткий",
      password: (value) =>
        value.length >= 5 ? null : "Пароль слишком короткий",
    },
  });

  const handleSubmit = () => {
    login(form.values);
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Input.Wrapper label="Имя" error={form.errors.username}>
          <Input
            w={400}
            size="md"
            placeholder="Введите ваше имя"
            {...form.getInputProps("username")}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Пароль">
          <PasswordInput
            w={400}
            size="md"
            placeholder="Введите ваш пароль"
            {...form.getInputProps("password")}
          />
        </Input.Wrapper>
        <Button
          loading={isLoading}
          type="submit"
          fullWidth
          size="md"
          color="var(--main-color)"
        >
          Войти
        </Button>
        <Flex gap={2} justify="center" align="center">
          <Text>Нет аккаунта? </Text>
          <NavLink to="/auth/register">
            <Text c="var(--main-color)" fw={600}>
              Зарегистрироваться
            </Text>
          </NavLink>
        </Flex>
      </Stack>
    </form>
  );
};

export default LoginForm;
