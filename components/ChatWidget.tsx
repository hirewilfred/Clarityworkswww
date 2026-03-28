import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "cws_chat_history";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.content || "Sorry, I couldn't get a response. Please try again.",
      };
      setMessages([...next, assistantMsg]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "3.5rem",
          height: "3.5rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #5c7cff 0%, #4a6ae8 100%)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(92,124,255,0.5)",
          zIndex: 9999,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 6px 32px rgba(92,124,255,0.7)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 24px rgba(92,124,255,0.5)";
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Chat drawer */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "5.5rem",
            right: "1.5rem",
            width: "340px",
            height: "480px",
            borderRadius: "1rem",
            background: "rgba(5,6,20,0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(92,124,255,0.25)",
            boxShadow: "0 8px 48px rgba(92,124,255,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            overflow: "hidden",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid rgba(92,124,255,0.2)",
              background: "linear-gradient(135deg, rgba(92,124,255,0.15) 0%, rgba(74,106,232,0.1) 100%)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #5c7cff 0%, #4a6ae8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.875rem" }}>
                ClarityWorks AI
              </div>
              <div style={{ color: "#a5b4fc", fontSize: "0.7rem" }}>
                Usually replies instantly
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#a5b4fc",
                  fontSize: "0.8rem",
                  marginTop: "2rem",
                  lineHeight: 1.6,
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>👋</div>
                <strong style={{ color: "#fff", display: "block", marginBottom: "0.25rem" }}>
                  Hi! I'm the ClarityWorks AI.
                </strong>
                Ask me about our AI consulting, agent development, or website design services.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "0.625rem 0.875rem",
                    borderRadius:
                      msg.role === "user"
                        ? "1rem 1rem 0.25rem 1rem"
                        : "1rem 1rem 1rem 0.25rem",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #5c7cff 0%, #4a6ae8 100%)"
                        : "rgba(255,255,255,0.07)",
                    border:
                      msg.role === "user"
                        ? "none"
                        : "1px solid rgba(92,124,255,0.15)",
                    color: "#fff",
                    fontSize: "0.825rem",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "0.625rem 0.875rem",
                    borderRadius: "1rem 1rem 1rem 0.25rem",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(92,124,255,0.15)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#5c7cff",
                        display: "inline-block",
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderTop: "1px solid rgba(92,124,255,0.15)",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask us anything…"
              disabled={loading}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(92,124,255,0.2)",
                borderRadius: "0.625rem",
                padding: "0.5rem 0.75rem",
                color: "#fff",
                fontSize: "0.825rem",
                outline: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(92,124,255,0.6)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(92,124,255,0.2)";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "0.625rem",
                background:
                  loading || !input.trim()
                    ? "rgba(92,124,255,0.3)"
                    : "linear-gradient(135deg, #5c7cff 0%, #4a6ae8 100%)",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Footer attribution */}
          <div
            style={{
              textAlign: "center",
              padding: "0.375rem",
              fontSize: "0.65rem",
              color: "rgba(165,180,252,0.5)",
              borderTop: "1px solid rgba(92,124,255,0.08)",
            }}
          >
            Powered by Claude AI
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
