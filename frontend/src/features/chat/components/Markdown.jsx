import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Tailwind's reset strips default heading/list/table styles, so give the model's
// Markdown (headings, lists, tables, code) readable styling that fits the theme.
// react-markdown does not render raw HTML, so model output can't inject markup.
const components = {
  h1: (p) => <h1 className="mb-2 mt-4 font-display text-2xl font-semibold" {...p} />,
  h2: (p) => <h2 className="mb-2 mt-4 font-display text-xl font-semibold" {...p} />,
  h3: (p) => <h3 className="mb-1 mt-3 text-base font-semibold" {...p} />,
  p: (p) => <p className="my-2 leading-relaxed" {...p} />,
  ul: (p) => <ul className="my-2 list-disc space-y-1 pl-5" {...p} />,
  ol: (p) => <ol className="my-2 list-decimal space-y-1 pl-5" {...p} />,
  a: (p) => (
    <a className="underline decoration-gold underline-offset-4" target="_blank" rel="noreferrer noopener" {...p} />
  ),
  pre: (p) => (
    <pre className="my-3 overflow-x-auto bg-ink p-3 text-xs leading-relaxed text-paper" {...p} />
  ),
  code: ({ className, ...p }) =>
    className ? (
      <code className={className} {...p} />
    ) : (
      <code className="bg-sand px-1 py-0.5 text-[0.85em]" {...p} />
    ),
  table: (p) => (
    <div className="my-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...p} />
    </div>
  ),
  th: (p) => <th className="border border-line bg-sand px-3 py-2 text-left font-medium" {...p} />,
  td: (p) => <td className="border border-line px-3 py-2 align-top" {...p} />,
};

const Markdown = ({ children }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
    {children}
  </ReactMarkdown>
);

export default Markdown;
