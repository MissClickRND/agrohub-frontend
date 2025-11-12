import { InputEvent } from "react";
import { chatStore } from "../../chatStore";
import { sendChatCompletionStream, sendMessage } from "../../api";

export const useChat = () => {
  const {
    messages,
    setMessages,
    currentMessage,
    currentFieldId,
    setCurrentFieldId,
    setCurrentMessage,
    setIsSendAvailable,
    isSendAvailable,
  } = chatStore();

  const handleInput = (e: InputEvent<HTMLInputElement>) => {
    setCurrentMessage(e.currentTarget.value);
  };

  const handleChangeField = (fieldId: number) => {
    setCurrentFieldId(fieldId);
  };

  const handleSendMessageStream = () => {
    if (currentMessage && currentFieldId) {
      setIsSendAvailable(false);
      setMessages([
        ...messages,
        { author: "user", id: messages.length, content: currentMessage },
      ]);
      sendChatCompletionStream(
        {
          model: "llama3.2:latest",
          prompt: currentMessage,
          fieldId: currentFieldId,
        },
        (res) => {
          const content = res.data;
          if (messages[messages.length - 1].author === "user") {
            setMessages([
              ...messages,
              {
                author: "agent",
                id: messages[messages.length - 1].id + 1,
                content,
              },
            ]);
          } else {
            setMessages([
              ...messages.slice(0, messages.length - 1),
              { ...messages[messages.length - 1], content },
            ]);
          }
        },
        () => {
          if (messages[messages.length - 1].author === "agent") {
            setMessages([
              ...messages.slice(0, messages.length - 1),
              {
                ...messages[messages.length - 1],
                content:
                  "Произошла ошибка, проверьте соединение с сетью и попробуйте ещё раз",
              },
            ]);
          } else {
            setMessages([
              ...messages,
              {
                author: "agent",
                id: messages.length,
                content:
                  "Произошла ошибка, проверьте соединение с сетью и попробуйте ещё раз",
              },
            ]);
          }
        },
        () => {
          setIsSendAvailable(true);
        }
      );
      setCurrentMessage("");
    }
  };

  const handleSendMessage = () => {
    (async () => {if (currentMessage && currentFieldId) {
      const newMessages = [...messages]
        try {
      setIsSendAvailable(false);
      setMessages([
        ...newMessages,
        { author: "user", id: newMessages.length, content: currentMessage },
      ]);
      newMessages.push({author: 'user', id: newMessages.length, content: currentMessage})
      const res = await sendMessage({
        model: "llama3.2:latest",
        prompt: currentMessage,
        fieldId: currentFieldId,
      });
      setCurrentMessage("")
      setMessages([
        ...newMessages,
        { author: "agent", id: newMessages.length, content: res.response },
      ]);
      newMessages.push({author: "agent", id: newMessages.length, content: res.response})

        } catch {
            setMessages([...newMessages, {author: "agent", id: newMessages.length, content: "Произошла ошибка, проверьте соединение с сетью и попробуйте ещё раз"}])
            setCurrentMessage("")
        } finally {
            setIsSendAvailable(true)
        }
    }})()
  };

  return {
    messages,
    currentMessage,
    handleInput,
    handleChangeField,
    handleSendMessageStream,
    handleSendMessage,
    isSendAvailable,
    currentFieldId
  };
};
