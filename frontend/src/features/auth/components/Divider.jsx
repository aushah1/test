const Divider = ({ children = "or" }) => (
  <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-muted">
    <span className="h-px flex-1 bg-line" />
    {children}
    <span className="h-px flex-1 bg-line" />
  </div>
);

export default Divider;
