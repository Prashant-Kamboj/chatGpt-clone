import { Button } from "@/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Header } from "components/Header";

import React, { useRef, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { parse } from "partial-json";
import ReactMarkdown from "react-markdown";

export const loader = async () => {
  return null;
};

export default function ChatComponent() {
  const ref = useRef<HTMLTextAreaElement>(null);

  const [aiResponse, setAiResponse] = useState<Record<string, string>[]>([]);
  const [animate, setAnimate] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/chat?message=${ref.current?.value || ""}`,
      {
        method: "POST",
      }
    );
    const reader = (response.body as ReadableStream).getReader();
    if (!reader) {
      return;
    }

    const decoder = new TextDecoder();
    let data = "";
    let parsed = {} as { answer: string };

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        if (ref.current) {
          ref.current.value = ""; // Clear the input after sending
        }
        setIsLoading(false);
        break;
      }
      data += decoder.decode(value);
      // console.log("Decoded data: ", data);
      parsed = parse(data);
      setAiResponse((prev) => {
        if (prev.find((item) => item.request === ref.current?.value)) {
          const currentResponse = prev.find(
            (item) => item.request === ref.current?.value
          );
          return [
            ...prev.filter((item) => item.request !== ref.current?.value),
            {
              request: currentResponse?.request || "",
              response: parsed.answer,
            },
          ];
        }
        return [
          ...prev,
          {
            request: ref.current?.value || "",
            response: parsed.answer || "",
          },
        ];
      });

      setAnimate(true);
    }
  };

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
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message here..."
            className="w-full h-15 p-4 border-1 rounded-[60px] focus:outline-none focus:ring-1 mx-auto"
          />
          <Button
            disabled={isLoading}
            onClick={handleSend}
            className="mt-4 w-full bg-black border rounded-[60px] text-white py-2 hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
          >
            {
              <Loader2Icon
                className={`animate-spin ${isLoading ? "inline-block" : "hidden"}`}
              />
            }
            {!isLoading && "Ask via stream!"}
          </Button>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
