import { ActionIcon, Flex, Input, useMantineTheme } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useChat } from "../model/lib/hooks/useChat";
import { KeyboardEvent } from "react";

export const ChatInput = () => {
    const theme = useMantineTheme()
    const {handleInput, handleSendMessage, currentMessage} = useChat()
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
        value={currentMessage}
        onInput={handleInput}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {if(e.key === "Enter") handleSendMessage()}}
        placeholder="Задайте свой вопрос"
        radius={"xl"}
        rightSectionPointerEvents="auto"
        rightSection={
          <ActionIcon
            onClick={(e) => {
              e.stopPropagation(); // Prevent the click from bubbling up to the input
              handleSendMessage();
            }}
            variant="filled"
            radius={"xl"}
            size={"xl"}
            color="primary.5"
            style={{ marginLeft: 4 }} // Add a small margin to separate from input text
          >
            <IconArrowRight />
          </ActionIcon>
        }
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
