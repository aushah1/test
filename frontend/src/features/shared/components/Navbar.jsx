import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import { useAuth } from "../../auth/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "Chat" },
];

const linkClass = ({ isActive }) =>
  `text-sm tracking-wide transition-colors duration-200 ${
    isActive ? "text-ink" : "text-muted hover:text-ink"
  }`;

const Navbar = () => {
  const { pathname } = useLocation();
  // The menu counts as open only on the route where it was opened,
  // so navigating anywhere closes it without an effect.
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === pathname;
  const setOpen = (value) =>
    setOpenAt((prev) => {
      const next = typeof value === "function" ? value(prev === pathname) : value;
      return next ? pathname : null;
    });
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const { handleLogout } = useAuth();

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onLogout = async () => {
    await handleLogout();
    setOpen(false);
    navigate("/login");
  };

  const authActions = loading ? null : user ? (
    <>
      <span className="truncate text-sm text-muted">
        Hi, <span className="text-ink">{user.username}</span>
      </span>
      <button
        onClick={onLogout}
        className="cursor-pointer border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-gold"
      >
        Log out
      </button>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="text-sm text-muted transition-colors hover:text-ink"
      >
        Log in
      </Link>
      <Link
        to="/register"
        className="bg-ink px-4 py-2 text-center text-sm text-paper transition-colors hover:bg-gold-dark"
      >
        Sign up
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main"
      >
        <Logo />

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-4 md:flex">{authActions}</div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 flex h-10 w-10 cursor-pointer items-center justify-center text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className={`overflow-hidden ${open ? "visible" : "invisible"}`}>
          <div className="flex flex-col gap-4 border-t border-line px-4 py-5 sm:px-6">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-3 border-t border-line pt-4">
              {authActions}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
