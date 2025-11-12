import { Button, Text, useMantineTheme } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

type Props = {
  onClick?: () => void;
};

function AgrohubSpotlightButton({ onClick }: Props) {
  const theme = useMantineTheme();

  return (
    <Button
      onClick={onClick}
      w={300}
      style={{ cursor: "text", borderColor: "var(--white-gray)" }}
      variant={"outline"}
      justify={"start"}
      leftSection={<IconSearch color={theme.colors.primary[7]} />}
    >
      <Text c={"gray"} fw={"500"} fz={14}>
        Навигация...
      </Text>
    </Button>
  );
}

export default AgrohubSpotlightButton;
