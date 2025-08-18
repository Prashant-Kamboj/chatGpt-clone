import { OpenAI } from "openai";

export const postPrompt = async (prompt: string) => {
  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: import.meta.env.VITE_OPEN_ROUTE_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
      },
    });
    const completion = await openai.chat.completions.create({
      model: "google/gemma-3n-e2b-it:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
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
  } catch (error: any) {
    return `Rate limit exceeded or an error occurred: ${error?.message}`;
  }
};

// const reader = response.data.getReader() -> response.body -> fetcher.data.getReader();
// const decoder = new TextDecoder();
// while(true) {
// const {value, done}  = await reder.read();
// if(done) {
//   break;}
// data += decoder.decode(value);
// parsed = JSON.parse(data);
// if(parsed.answer) {
//   setState to update react
// }
// }
