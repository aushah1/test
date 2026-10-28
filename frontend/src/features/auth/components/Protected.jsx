import { useSelector } from "react-redux";
import { Navigate } from "react-router";

// Usage: <Protected><Page /></Protected>  or  <Protected role="admin">...</Protected>
// `role` is optional - only checked when you pass it (and your user has one).
const Protected = ({ children, role }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default Protected;
