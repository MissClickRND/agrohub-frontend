import { Paper, Stack, Text, useMantineTheme } from '@mantine/core'
import { chatsMock } from '../../../../../../mocks/chatsMock'
import {motion} from 'motion/react'

export const ChatsList = () => {
  const theme = useMantineTheme()
  return (
    <Paper withBorder style={{position: "absolute", left: 0, top: 0}} h={"100%"} w={"20rem"}>
      <Stack align='center' pt={"6rem"} gap={0}>
        <Text style={{alignSelf: "start"}} ml={"1rem"} c={'neutral.4'}>Чаты:</Text>
        {chatsMock.map((chat) => (
          <Paper whileHover={{backgroundColor: theme.colors.neutral[1]}} component={motion.div} p={'.5rem 1rem'} w={"90%"} bg={"transparent"}>
            <Text>
              {chat.name}
            </Text>
          </Paper>
        )) }
      </Stack>

    </Paper>
  )
}
