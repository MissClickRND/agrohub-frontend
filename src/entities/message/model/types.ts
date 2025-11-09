export type Message = {
    id: number,
    author: MessageAuthor,
    content: string
}

export type MessageAuthor = "agent" | "user"