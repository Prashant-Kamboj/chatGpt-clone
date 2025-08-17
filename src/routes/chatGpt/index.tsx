import { Button } from "@/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Footer } from "components/Footer";
import { Header } from "components/Header";
import OpenAI from "openai";
import {
  useFetcher,
  useLoaderData,
  type ActionFunctionArgs,
} from "react-router";
import React, { useEffect, useRef, useState } from "react";
import { postPrompt } from "./services/postPrompt/index.server";
import { Loader2Icon } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const loader = async () => {};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log(process.env.VITE_OPEN_ROUTE_API_KEY, " VITE_OPEN_ROUTE_API_KEY");
  try {
    const fromData = await request.json();
    const message = fromData.message as string;
    const response = await postPrompt(message);
    return response;
  } catch (error) {
    console.error("Error in action:", error);
    return { error: "Failed to process the request" };
  }
};

export default function ChatComponent() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const fetcher = useFetcher();

  const [aiResponse, setAiResponse] = useState<Record<string, string>[]>([]);
  const [animate, setAnimate] = useState(false);

  const handleSend = async () => {
    fetcher.submit(
      {
        // This is where you would send the user's message to the OpenAI API
        message: ref.current?.value || "",
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };

  useEffect(() => {
    if (fetcher.data) {
      setAiResponse((prev) => [
        ...prev,
        {
          request: ref.current?.value || "",
          response: fetcher.data,
        },
      ]);
      setAnimate(true);
      if (ref.current) {
        ref.current.value = ""; // Clear the input after sending
      }
    }
  }, [fetcher.data]);

  console.log(animate, "animate");

  return (
    <div className="flex flex-col items-center justify-center h-[100vh] bg-gray-100">
      <Header />
      <main className={`flex flex-col w-full h-[calc(100vh-60px)] mt-[60px]`}>
        {aiResponse.length > 0 && (
          <div className="p-4 bg-white rounded-lg shadow-md h-[calc(100vh-60px)] overflow-y-scroll">
            {aiResponse.map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex justify-end">
                  <p className="bg-[#999999] rounded-[10px] p-2 text-white">
                    {item?.request?.length ? item.request : null}
                  </p>
                </div>
                <ReactMarkdown>
                  {item?.response?.length ? item.response : null}
                </ReactMarkdown>
              </React.Fragment>
            ))}
          </div>
        )}

        <div
          className={`flex flex-col transition-all duration-500 ease-in-out ${animate ? "justify-end" : "justify-center"} w-full ${!animate ? "h-full" : "h-[160px]"} px-8 py-2`}
        >
          <Textarea
            ref={ref}
            placeholder="Type your message here..."
            className="w-full h-15 p-4 border-1 rounded-[60px] focus:outline-none focus:ring-1 mx-auto"
          />
          <Button
            disabled={fetcher.state !== "idle"}
            onClick={handleSend}
            className="mt-4 w-full bg-black border rounded-[60px] text-white py-2 hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
          >
            {
              <Loader2Icon
                className={`animate-spin ${fetcher.state !== "idle" ? "inline-block" : "hidden"}`}
              />
            }
            {fetcher.state === "idle" && "Ask me anything!"}
          </Button>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
