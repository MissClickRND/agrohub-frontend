import { Stack } from "@mantine/core";
import { Message } from "../../../entities/message/ui/Message";
import { useChat } from "../model/lib/hooks/useChat";

export const MessagesList = () => {
  const { messages } = useChat()
  return (
    <Stack gap={"lg"}>
      {messages.map((message) => (
        <Message key={"message-" + message.id} message={message} />
      ))}
    </Stack>
  );
};
