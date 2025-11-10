import { Button, Flex, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { useMeStore } from "../../../entities/me/model/meStore";
import { useLogout } from "../../../features/auth/model/lib/hooks/useLogout";

export default function NavLayout() {
  const { logout } = useLogout();
  const { userName } = useMeStore();
  const links = [
    { name: "Главная", link: "/" },
    { name: "Поля", link: "/fields" },
    { name: "AI чат", link: "/chat-ai" },
    { name: "Логин", link: "/auth/login" },
    { name: "калькулятор", link: "/calculator"}
  ];

  return (
    <Flex gap={40} p={10} bg={"orange"}>
      {links.map((el, index) => (
        <NavLink to={el.link} key={index}>
          {({ isActive }) => (
            <Button bg={isActive ? "red" : "blue"}>{el.name}</Button>
          )}
        </NavLink>
      ))}

      <Text> USERNAME: {userName}</Text>
      <Button onClick={logout}>Выйти из аккаунта</Button>
    </Flex>
  );
}
