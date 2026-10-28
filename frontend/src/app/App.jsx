import { useEffect } from "react";
import { RouterProvider } from "react-router";
import "./App.css";
import { routes } from "./app.routes";
import { useAuth } from "../features/auth/hooks/useAuth";

function App() {
  const { handleGetMe } = useAuth();

  // Restore the session from the cookie on first load.
  useEffect(() => {
    handleGetMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RouterProvider router={routes} />;
}

export default App;
