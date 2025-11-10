import { UnstyledButton } from "@mantine/core";
import type { ReactNode } from "react";
import classes from "./NavBarButton.module.css";

type Props = {
  isSelected: boolean;
  children: ReactNode;
  onClick: (event: MouseEvent) => void;
};

function NavBarButton({ children, onClick, isSelected }: Props) {
  return (
    <UnstyledButton
      bg={isSelected ? "primary.4" : "#ecf8eb"}
      c={isSelected ? "white" : "primary.3"}
      className={classes.navBarButton}
      onClick={(e) => onClick(e.nativeEvent)}
    >
      {children}
    </UnstyledButton>
  );
}

export default NavBarButton;
