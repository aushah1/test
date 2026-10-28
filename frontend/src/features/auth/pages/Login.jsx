import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import Divider from "../components/Divider";
import SubmitButton from "../components/SubmitButton";
import ContinueWithGoogle from "../components/LoginWithGoogleBtn";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { handleLogin } = useAuth();
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(
    params.get("error") === "google"
      ? "Google sign-in failed. Please try again."
      : "",
  );
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors((errs) => ({ ...errs, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await handleLogin({ email: form.email.trim(), password: form.password });
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-medium text-ink underline decoration-gold underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <ContinueWithGoogle />
      <Divider />
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && (
          <div role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}
        <FormField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={onChange}
          error={fieldErrors.email}
        />
        <FormField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          value={form.password}
          onChange={onChange}
          error={fieldErrors.password}
        />
        <SubmitButton loading={submitting}>Log in</SubmitButton>
      </form>
    </AuthShell>
  );
};

export default Login;
