import { ActionIcon, Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import { motion } from "motion/react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { chatListVar } from "../model/animations";
import { useGetFields } from "../../../../Map/model/lib/hooks/useGetFields";
import { useChat } from "../../../model/lib/hooks/useChat";

export const ChatsList = () => {
  const theme = useMantineTheme();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { fields } = useGetFields();
  const { handleChangeField, currentFieldId } = useChat();
  return (
    <Paper
      component={motion.div}
      variants={chatListVar}
      initial="hide"
      animate={isOpen ? "show" : "hide"}
      withBorder
      style={{ position: "absolute", left: 0, top: 0 }}
      h={"100%"}
      w={"20rem"}
    >
      <Stack align="center" mah={"40%"} pt={"2rem"} gap={0}>
        <Text style={{ alignSelf: "start" }} ml={"1rem"} c={"neutral.4"}>
          Поля:
        </Text>
        {fields &&
          fields.map((field) => (
            <Paper
              onClick={() => {
                if (field.id) {
                  handleChangeField(field.id);
                }
              }}
              whileHover={{ backgroundColor: theme.colors.neutral[1] }}
              animate={{ backgroundColor: field.id === currentFieldId ? theme.colors.primary[2] : "transparent"}}
              component={motion.div}
              p={".5rem 1rem"}
              w="90%"
              bg={currentFieldId === field.id ? "primary.2" : "transparent"}
            >
              <Text>{field.name}</Text>
            </Paper>
          ))}
      </Stack>
      {/* <Stack align="center" mah={"40%"} pt={"2rem"} gap={0}>
        <Text style={{ alignSelf: "start" }} ml={"1rem"} c={"neutral.4"}>
          Поля:
        </Text>
        {fields &&
          fields.map((field) => (
            <Paper
              whileHover={{ backgroundColor: theme.colors.neutral[1] }}
              component={motion.div}
              p={".5rem 1rem"}
              w="90%"
              bg={"transparent"}
            >
              <Text>{field.name}</Text>
            </Paper>
          ))}
      </Stack> */}

      <ActionIcon
        style={{ position: "absolute", top: "2rem", left: "20.5rem" }}
        onClick={() => setIsOpen(!isOpen)}
        color="primary.7"
      >
        {isOpen ? <IconArrowLeft /> : <IconArrowRight />}
      </ActionIcon>
    </Paper>
  );
};
