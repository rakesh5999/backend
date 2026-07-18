import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage,tool,createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";


const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

function formatMessages(messages) {
  return messages.map((msg) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    } else if (msg.role === "ai") {
      return new AIMessage(msg.content);
    } else if (msg.role === "system") {
      return new SystemMessage(msg.content);
    }
  });
}

const searchInternetTool= tool(
  searchInternet,
  {
   name:"searchInternet",
   description:"Use this tool to get the latest infromation from the internet",
   schema:z.object({
    query:z.string().describe("The search query to look up on the internet ")
   })
  }
)

const geminiAgent= createAgent({
model:geminiModel,
tools:[searchInternetTool],
})
const mistralAgent = createAgent({
   model: mistralModel,
    tools: [searchInternetTool]
   });

export async function generateResponse(messages) {
  const formattedMessages = formatMessages(messages);

  try {
    const response = await geminiAgent.invoke({ messages: formattedMessages });
    console.log("✅ Response from Gemini");
    return response.messages[response.messages.length - 1].text;
  } catch (err) {
    console.log("❌ Gemini failed. Switching to Mistral...");
    console.error(err.message);

    const response = await mistralAgent.invoke({ messages: formattedMessages });
    console.log("✅ Response from Mistral");
    return response.messages[response.messages.length - 1].text;
  }
}

export async function generateTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
      You are a helpful assistant that generates concise and descriptive titles for chat conversations.

      User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words.
    `),
    new HumanMessage(`
      Generate a title for a chat conversation based on:
      "${message}"
    `),
  ]);

  return response.text;
}