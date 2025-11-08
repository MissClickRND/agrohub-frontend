import { Button, Flex } from "@mantine/core";
import { NavLink } from "react-router-dom";

export default function NavLayout() {
  const links = [
    { name: "Главная", link: "/" },
    { name: "О нас", link: "/about" },
  ];

  return (
    <Flex gap={40} p={20}>
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
