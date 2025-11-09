import { Box, Stack } from "@mantine/core";
import { messagesMock } from "../../../../mocks/messagesMock";
import { Message } from "../../../entities/message/ui/Message";

export const MessagesList = () => {
  return (
    <Stack gap={"lg"}>
      {messagesMock.map((message) => (
        <Message key={"message-" + message.id} message={message} />
      ))}
    </Stack>
  );
};
