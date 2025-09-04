export const processStreamResponse = async ({
  response,
  onChunk,
}: {
  response: any;
  onChunk: any;
}) => {
  console.log(response, "response in processStreamResponse");
  const reader = await response.body?.getReader();
  console.log(reader, "reader in processStreamResponse");
  if (!reader) {
    throw new Error(
      "Response body is undefined. Ensure the server is returning a valid stream."
    );
  }
  let string = "";
  while (true) {
    const stream = await reader?.read();
    if (stream.done) break;

    const chunks = stream?.value
      .replaceAll(/^data: /gm, "")
      .split("\n")
      .filter((c: any) => Boolean(c.length) && c !== "[DONE]")
      .map((c: any) => JSON.parse(c));

    for (let chunk of chunks) {
      const content = chunk.choices[0].delta.content;
      if (!content) continue;
      string += chunk.choices[0].delta.content;
      onChunk(string);
    }
  }
  return string;
};
