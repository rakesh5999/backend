import { initailzeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessages, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {

  const dispatch = useDispatch()

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setLoading(true))
      const data = await sendMessage({ message, chatId })
      const { chat, aiMessage } = data
      
      const activeChatId = chatId || chat._id;

      if (!chatId) {
        dispatch(createNewChat({
          chatId: chat._id,
          title: chat.title
        }))
      }

      dispatch(addNewMessages({
        chatId: activeChatId,
        content: message,
        role: "user"
      }))
      dispatch(addNewMessages({
        chatId: activeChatId,
        content: aiMessage.content,
        role: aiMessage.role
      }))
      dispatch(setCurrentChatId(activeChatId));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }


  async function handleGetChats() {
    dispatch(setLoading(true))
    const data = await getChats()
    const { chats } = data
    dispatch(setChats(chats.reduce((acc, chat) => {
      acc[chat._id] = {
        id: chat._id,
        title: chat.title,
        messages: [],
        lastUpdated: chat.updatedAt
      }
      return acc
    }, {})))
    dispatch(setLoading(false))
  }


  async function handleOpenChat(chatId) {
    const data = await getMessages(chatId)
    const { messages } = data
    const formattedMessages = messages.map(msg => ({
      content: msg.content,
      role: msg.role
    }))

    dispatch(addMessages({
      chatId,
      messages: formattedMessages
    }))

    dispatch(setCurrentChatId(chatId))


  }





  return {
    initailzeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat
  }
}

