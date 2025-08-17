import axios from "axios";
export const getAIModels = async () => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer${import.meta.env.VITE_OPEN_ROUTE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching AI models:", error);
    return {
      error: "Failed to fetch AI models",
    };
  }
};
