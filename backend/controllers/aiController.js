import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error(
    "API key for Google Generative AI is missing. Set GOOGLE_GENERATIVE_AI_API_KEY in environment variables."
  );
}

export function formatResponse(inputText) {
  let formattedText = marked(inputText);

  formattedText = formattedText.replace(/```(.*?)```/gs, (match, p1) => {
    return `<pre><code class="language-javascript">${p1}</code></pre>`;
  });
  console.log(10);
  return formattedText;
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const threadHistory = new Map();

export async function continueThread(userId, userPrompt) {
  try {
    console.log(userId + " " + userPrompt);
    let threadData = threadHistory.get(userId) || {
      messages: [],
      thread_id: null,
    };

    const history = threadData.messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = history
      ? `${history}\nUser: As a Python tutor, explain this concept in a way that students from grade 4 to 12 can easily understand. Use simple words, real-life examples, and step-by-step explanations.\nUser's Question: ${userPrompt}\nAssistant:`
      : `User: As a Python tutor, explain this concept in a way that students from grade 4 to 12 can easily understand. Use simple words, real-life examples, and step-by-step explanations.\nUser's Question: ${userPrompt}\nAssistant:`;

    const result = await model.generateContent(prompt);

    const assistantResponse =
      result.response.candidates[0].content.parts[0].text;

    threadData.messages.push({ role: "user", content: userPrompt });
    threadData.messages.push({ role: "assistant", content: assistantResponse });

    if (threadData.messages.length > 50) {
      threadData.messages = threadData.messages.slice(-50);
    }

    threadHistory.set(userId, threadData);

    return formatResponse(assistantResponse);
  } catch (error) {
    console.error(`Error processing chat for user ${userId}:`, error.message);
    return "Sorry, I couldn't process your request. Please try again later.";
  }
}
