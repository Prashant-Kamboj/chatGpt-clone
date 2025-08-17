import { OpenAI } from "openai";
import { redirect, type ActionFunctionArgs } from "react-router";

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const message = searchParams.get("message");

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
    },
  });

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant designed to output JSON like {answer: response}.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    stream: true,
    response_format: { type: "json_object" },
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(new TextEncoder().encode(content));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
};
