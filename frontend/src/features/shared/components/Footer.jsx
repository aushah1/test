import { Link } from "react-router";
import Logo from "./Logo";

const columns = [
  {
    title: "Product",
    items: [
      { label: "Home", to: "/" },
      { label: "Log in", to: "/login" },
      { label: "Sign up", to: "/register" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

const itemClass = "text-sm text-muted transition-colors hover:text-ink";

const Footer = () => {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Build faster, ship sooner. A starter made for hackathons.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link to={item.to} className={itemClass}>
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href} className={itemClass}>
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Buildify. All rights reserved.</p>
          <p>Made with care at a hackathon.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
