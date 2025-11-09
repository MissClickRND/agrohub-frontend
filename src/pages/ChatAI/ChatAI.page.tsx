import { Flex } from "@mantine/core";
import { ChatInput } from "../../features/chat/ui/ChatInput";
import { MessagesList } from "../../features/chat/ui/MessagesList";
import { ChatsList } from "../../features/chat/ui/ChatsList/ui/ChatsList";

export default function ChatAI() {
  return (
    <Flex w={"100vw"} justify={"center"}>
      <Flex
        style={{
          position: "relative",
        }}
        justify={"end"}
        direction="column"
        h={"calc(100vh - 76px)"}
        w="calc(100% - 10rem)"
        maw="50rem"
        bg="white"
        pb={"7rem"}
      >
        <ChatInput />
        <MessagesList />
      </Flex>
      <ChatsList />
    </Flex>
  );
}
