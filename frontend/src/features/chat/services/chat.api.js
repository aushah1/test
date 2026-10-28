import axios from "axios";

// Same base-URL rule as auth.api.js: dev uses the Vite proxy, prod uses VITE_BACKEND_URL.
const apiUrl =
  import.meta.env.VITE_MODE?.trim() === "development"
    ? "/api"
    : `${import.meta.env.VITE_BACKEND_URL?.trim()}/api`;

const chatApiInstance = axios.create({
  baseURL: `${apiUrl}/ai`,
  withCredentials: true,
  timeout: 60000, // model replies can take a while
});

chatApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === "ECONNABORTED"
        ? "The model took too long to answer. Please try again."
        : error.request
          ? "Cannot reach the server"
          : error.message);
    const err = new Error(message);
    err.status = error.response?.status;
    return Promise.reject(err);
  },
);

export async function getSkills() {
  const response = await chatApiInstance.get("/skills");
  return response.data;
}

// messages: [{ role: "user" | "assistant", content }]; skill: optional skill name.
export async function sendChat({ messages, skill }) {
  const response = await chatApiInstance.post("/chat", { messages, skill });
  return response.data;
}
