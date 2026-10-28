const SubmitButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full cursor-pointer bg-ink px-4 py-3 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-gold-dark focus:outline-none focus:ring-1 focus:ring-gold focus:ring-offset-2 focus:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-60"
  >
    {loading ? "Please wait..." : children}
  </button>
);

export default SubmitButton;
