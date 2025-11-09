import { Box, Flex, Text, useMantineTheme } from "@mantine/core"
import { Message as MessageType } from "../model/types"
import { FC } from "react"

interface IProps {
    message: MessageType
}

export const Message: FC<IProps> = ({message}) => {
  return (
    <Flex justify={message.author === "user" ? "end" : "start"} w={"100%"}>
        <Box style={{borderRadius: "1rem"}} bg={message.author === "user" ? "primary.2" : ""} p={"1rem"}>
            <Text>
                {message.content}
            </Text>
        </Box>      
    </Flex>
  )
}
