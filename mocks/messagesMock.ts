import type {Message} from "../src/entities/message/model/types"
export const messagesMock: Message[] = [
    {
        id: 1,
        author: 'user',
        content: "Hello"
    },
    {
        id: 2,
        author: "agent",
        content: 'Hello user!'
    },
    {
        id: 3,
        author: "user",
        content: "How can i improve plants grows",
    },
    {
        id: 4,
        author: "agent",
        content: "I don't know, i am not a farmer"
    }
]