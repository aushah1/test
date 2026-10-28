import Logo from "../../shared/components/Logo";

// Split layout: decorative panel on large screens, form on every screen.
const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    <aside className="relative hidden overflow-hidden bg-ink p-12 text-paper lg:flex lg:flex-col lg:justify-between">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold/30"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-[28rem] w-[28rem] rounded-full border border-gold/20"
        aria-hidden="true"
      />
      <Logo className="!text-paper" />
      <div className="relative">
        <p className="font-display text-5xl font-semibold leading-[1.1]">
          Ideas deserve
          <br />a faster start.
        </p>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/60">
          Sign in to pick up where you left off, or create an account in under a
          minute.
        </p>
      </div>
      <p className="relative text-xs text-paper/40">
        &copy; {new Date().getFullYear()} Buildify
      </p>
    </aside>

    <main className="flex flex-col px-4 py-8 sm:px-8">
      <div className="lg:hidden">
        <Logo />
      </div>
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
        <h1 className="font-display text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-8 text-center text-sm text-muted">{footer}</p>
      </div>
    </main>
  </div>
);

export default AuthShell;
