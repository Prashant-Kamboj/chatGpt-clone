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
    return completion.toReadableStream();

    // return new Response(completion.toReadableStream(), {
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     "Cache-Control": "no-cache",
    //     Connection: "keep-alive",
    //   },
    // });
    // return completion.choices[0].message.content; // Return the response content
  } catch (error: any) {
    return `Rate limit exceeded or an error occurred: ${error?.message}`;
  }
};
