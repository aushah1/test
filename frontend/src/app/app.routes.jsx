import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Home from "../features/home/pages/Home";
import Chat from "../features/chat/pages/Chat";
import Protected from "../features/auth/components/Protected";

export const routes = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/chat",
        element: (
          <Protected>
            <Chat />
          </Protected>
        ),
      },
    ],
  },
]);
