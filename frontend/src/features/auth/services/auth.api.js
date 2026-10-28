import axios from "axios";

const apiUrl =
  import.meta.env.VITE_MODE?.trim() === "development"
    ? "/api"
    : `${import.meta.env.VITE_BACKEND_URL?.trim()}/api`;

const authApiInstance = axios.create({
  baseURL: `${apiUrl}/auth`,
  withCredentials: true,
});

// Turn any axios failure into an Error carrying the server's message.
authApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.request ? "Cannot reach the server" : error.message);
    const err = new Error(message);
    err.status = error.response?.status;
    return Promise.reject(err);
  },
);

export async function register({ username, email, password }) {
  const response = await authApiInstance.post("/register", {
    username,
    email,
    password,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await authApiInstance.post("/login", { email, password });
  return response.data;
}

export async function logout() {
  const response = await authApiInstance.post("/logout");
  return response.data;
}

export async function getMe() {
  const response = await authApiInstance.get("/get-user");
  return response.data;
}
