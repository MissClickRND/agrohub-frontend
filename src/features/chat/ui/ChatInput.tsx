import { ActionIcon, Flex, Input, useMantineTheme } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

export const ChatInput = () => {
    const theme = useMantineTheme()
  return (
    <Flex
      w={"100%"}
      style={{
        position: "absolute",
        bottom: "1.5rem",
      }}
      justify={"center"}
      align={"center"}
    >
      <Input
        rightSection={
          <ActionIcon
            variant="filled"
            radius={"xl"}
            size={"xl"}
            color="primary.5"
          >
            <IconArrowRight />
          </ActionIcon>
        }
        placeholder="Задайте свой вопрос"
        radius={"xl"}
        styles={{
          input: {
            borderColor: theme.colors.primary[5],
          },
        }}
        size="lg"
        w={"100%"}
      />
    </Flex>
  );
};
