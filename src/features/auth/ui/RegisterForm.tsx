import { Button, Flex, Input, PasswordInput, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { NavLink } from "react-router-dom";
import { useRegister } from "../model/lib/hooks/useRegister";

const RegisterForm = () => {
  const { isLoading, register } = useRegister();
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    validate: {
      name: (value: string) =>
        value.length >= 3 ? null : "Имя слишком короткое",
      email: (value: string) =>
        value.length >= 3 ? null : "Почта слишком короткая",
      password: (value: string) =>
        value.length >= 5 ? null : "Пароль слишком короткий",
      repeatPassword: (value: string, values) =>
        value === values.password ? null : "Пароли не совпадают",
    },
  });

  const handleSubmit = () => {
    register({
      name: form.values.name,
      email: form.values.email,
      password: form.values.password,
    });
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Input.Wrapper label="Имя" error={form.errors.name}>
          <Input
            w={400}
            size="md"
            placeholder="Введите ваше имя"
            {...form.getInputProps("name")}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Email" error={form.errors.email}>
          <Input
            w={400}
            size="md"
            placeholder="Введите вашу почту"
            {...form.getInputProps("email")}
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
        <Input.Wrapper label="Повторите пароль">
          <PasswordInput
            size="md"
            w={400}
            placeholder="Повторите ваш пароль"
            {...form.getInputProps("repeatPassword")}
          />
        </Input.Wrapper>
        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          size="md"
          color="var(--main-color)"
        >
          Зарегистрироваться
        </Button>
        <Flex gap={2} justify="center" align="center">
          <Text>Уже есть аккаунт?</Text>
          <NavLink to="/auth/login">
            <Text c="var(--main-color)" fw={600}>
              Войти
            </Text>
          </NavLink>
        </Flex>
      </Stack>
    </form>
  );
};

export default RegisterForm;
