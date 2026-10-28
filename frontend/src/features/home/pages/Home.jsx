import { Link } from "react-router";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start px-4 py-20 sm:px-6 sm:py-28">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-dark">
        Hackathon starter
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
        {user ? `Welcome back, ${user.username}.` : "Build something great, fast."}
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        Authentication, a database and a clean UI are already wired up, so you
        can spend the weekend on the idea instead of the setup.
      </p>
      {!user && (
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/register"
            className="bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition-colors hover:bg-gold-dark"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="border border-line px-6 py-3 text-center text-sm font-medium transition-colors hover:border-gold"
          >
            Log in
          </Link>
        </div>
      )}
    </section>
  );
};

export default Home;
