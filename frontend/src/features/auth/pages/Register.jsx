import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import Divider from "../components/Divider";
import SubmitButton from "../components/SubmitButton";
import ContinueWithGoogle from "../components/LoginWithGoogleBtn";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors((errs) => ({ ...errs, [e.target.name]: "" }));
  };

  // Mirrors the backend validator so users get instant feedback.
  const validate = () => {
    const errs = {};
    if (form.username.trim().length < 3)
      errs.username = "Username must be at least 3 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Enter a valid email";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
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
      await handleRegister({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It only takes a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-ink underline decoration-gold underline-offset-4">
            Log in
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
          id="username"
          name="username"
          label="Username"
          placeholder="yourname"
          autoComplete="username"
          value={form.username}
          onChange={onChange}
          error={fieldErrors.username}
        />
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
          placeholder="At least 6 characters"
          autoComplete="new-password"
          value={form.password}
          onChange={onChange}
          error={fieldErrors.password}
        />
        <SubmitButton loading={submitting}>Create account</SubmitButton>
      </form>
    </AuthShell>
  );
};

export default Register;
