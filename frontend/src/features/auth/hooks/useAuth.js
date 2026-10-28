import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../states/auth.slice";
import { register, login, logout, getMe } from "../services/auth.api";

// handleRegister / handleLogin throw on failure so forms can show the message.
export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    const data = await register({ username, email, password });
    dispatch(setUser(data.user));
    return data.user;
  }

  async function handleLogin({ email, password }) {
    const data = await login({ email, password });
    dispatch(setUser(data.user));
    return data.user;
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      dispatch(setError(err.message || "Failed to logout"));
    } finally {
      dispatch(setUser(null));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (err) {
      // 401 just means "not logged in" - not an error worth showing.
      dispatch(setUser(null));
      if (err.status !== 401) {
        dispatch(setError(err.message || "Failed to fetch user data"));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleRegister, handleLogin, handleLogout, handleGetMe };
};
