import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
  const chat = useChat();

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);


  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef(null);

  const messages =
    currentChatId && chats[currentChatId]
      ? chats[currentChatId].messages
      : [];

  useEffect(() => {
    chat.initailzeSocketConnection();
    chat.handleGetChats()
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    await chat.handleSendMessage({
      message: inputValue,
      chatId: currentChatId,
    });

    setInputValue("");
  };

  const openChat=(chatId)=>{
    chat.handleOpenChat(chatId)
  }

  return (
    <div className="h-screen flex bg-neutral-900 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col">

        <div className="p-5">
          <h1 className="text-2xl font-bold text-blue-400">
            Aether
          </h1>

          <button
            className="mt-5 w-full border border-neutral-700 rounded-lg py-2 hover:bg-neutral-800"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {Object.values(chats).map((chat,index) => (
            <button
              onClick={() => {openChat(chat.id)}}
              key={index}
              className={`w-full cursor-pointer text-left p-3 rounded-lg mb-2 ${
                currentChatId === chat.id
                  ? "bg-blue-700"
                  : "hover:bg-neutral-800"
              }`}
            >
              {chat.title}
            </button>
          ))}
        </div>

      </aside>

      {/* Chat */}

      <main className="flex-1 flex flex-col">

        <div className="messages flex-1 overflow-y-auto p-6">

          {messages.length === 0 ? (
            <div className="h-full flex justify-center items-center text-neutral-500">
              Ask Aether anything...
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-4 ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-lg px-4 py-3 rounded-2xl whitespace-pre-wrap ${
                      msg.role === "user" ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-100"
                    }`}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-700 rounded-2xl px-4 py-3">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />

            </div>
          )}

        </div>

        <form
          onSubmit={sendMessage}
          className="border-t border-neutral-800 p-4"
        >
          <div className="max-w-3xl mx-auto flex gap-2">

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Aether anything..."
              className="flex-1 bg-neutral-800 rounded-xl px-4 py-3 outline-none"
            />

            <button
              className="bg-blue-600 hover:bg-blue-700 px-5 rounded-xl"
            >
              Send
            </button>

          </div>
        </form>

      </main>
    </div>
  );
};

export default Dashboard;