import { useEffect, useRef, useState } from "react";
import { getSkills, sendChat } from "../services/chat.api";
import Markdown from "../components/Markdown";

// Only the most recent messages are sent, to stay inside request/model limits.
const MAX_HISTORY = 20;

const Chat = () => {
  const [skills, setSkills] = useState([]);
  const [skill, setSkill] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    getSkills()
      .then((data) => setSkills(data.skills))
      .catch(() => {}); // the chat still works without the skill list
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const activeSkill = skills.find((s) => s.name === skill);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError("");
    setSending(true);

    // The API needs the conversation to start with a user message.
    let history = next.slice(-MAX_HISTORY);
    while (history[0]?.role === "assistant") history = history.slice(1);

    try {
      const { reply } = await sendChat({ messages: history, skill: skill || undefined });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      // Roll the failed message back into the box so the user can just resend.
      setMessages(messages);
      setInput(text);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-dark">
            Powered by Gemma 4
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Chat</h1>
        </div>
        <div className="flex items-end gap-3">
          <label className="block text-sm">
            <span className="mb-1 block text-muted">Skill</span>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full min-w-44 border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="">None (plain chat)</option>
              {skills.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setError("");
            }}
            disabled={!messages.length || sending}
            className="cursor-pointer border border-line px-4 py-2 text-sm transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            New chat
          </button>
        </div>
      </div>

      {activeSkill && (
        <p className="mt-3 text-sm text-muted">{activeSkill.description}</p>
      )}

      <div
        className="mt-6 h-[55vh] overflow-y-auto border border-line bg-sand/40 p-4"
        aria-live="polite"
      >
        {!messages.length && (
          <p className="text-sm text-muted">
            Ask something to get started. Pick a skill above to make the model
            follow a specific workflow.
          </p>
        )}
        <ul className="space-y-4">
          {messages.map((m, i) => (
            <li key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
              <div
                className={`max-w-[85%] px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "whitespace-pre-wrap bg-ink text-paper"
                    : "border border-line bg-paper"
                }`}
              >
                {m.role === "user" ? m.content : <Markdown>{m.content}</Markdown>}
              </div>
            </li>
          ))}
          {sending && (
            <li className="flex">
              <div className="border border-line bg-paper px-4 py-3 text-sm text-muted">
                Thinking...
              </div>
            </li>
          )}
        </ul>
        <div ref={endRef} />
      </div>

      {error && (
        <div role="alert" className="mt-4 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          maxLength={4000}
          placeholder="Type a message. Enter to send, Shift+Enter for a new line."
          aria-label="Message"
          className="flex-1 resize-none border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-gold"
        />
        <button
          type="button"
          onClick={send}
          disabled={sending || !input.trim()}
          className="cursor-pointer self-stretch bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </section>
  );
};

export default Chat;
