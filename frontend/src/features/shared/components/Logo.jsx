import { Link } from "react-router";

const Logo = ({ className = "" }) => (
  <Link
    to="/"
    className={`inline-flex items-center gap-2 text-ink ${className}`}
    aria-label="Buildify home"
  >
    <span className="flex h-8 w-8 items-center justify-center border border-gold font-display text-lg font-bold text-gold-dark">
      B
    </span>
    <span className="font-display text-2xl font-semibold tracking-tight">
      Buildify
    </span>
  </Link>
);

export default Logo;
