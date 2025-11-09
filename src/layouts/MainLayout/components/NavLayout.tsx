import { Button, Flex } from "@mantine/core";
import { NavLink } from "react-router-dom";

export default function NavLayout() {
  const links = [
    { name: "Главная", link: "/" },
    { name: "Поля", link: "/fields" },
    { name: "AI чат", link: "/chat-ai" },
    { name: "Логин", link: "/auth/login" },
  ];

  return (
    <Flex style={{zIndex: 100, position: 'relative'}} gap={40} p={20} bg={"orange"}>
      {links.map((el, index) => (
        <NavLink to={el.link} key={index}>
          {({ isActive }) => (
            <Button bg={isActive ? "red" : "blue"}>{el.name}</Button>
          )}
        </NavLink>
      ))}
    </Flex>
  );
}
