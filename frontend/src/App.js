import { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [dark, setDark] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm your banking assistant. Upload a document and ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const theme = {
    bg: dark ? "#0f1117" : "#f0f4f8",
    card: dark ? "#1a1d2e" : "#ffffff",
    sidebar: dark ? "#13162b" : "#e8edf5",
    text: dark ? "#e2e8f0" : "#1a202c",
    subtext: dark ? "#8892a4" : "#4a5568",
    userBubble: dark ? "#3b5bdb" : "#4c6ef5",
    botBubble: dark ? "#252840" : "#edf2ff",
    botText: dark ? "#c8d3e8" : "#2d3748",
    input: dark ? "#1e2235" : "#ffffff",
    border: dark ? "#2d3354" : "#e2e8f0",
    btnPrimary: "#4c6ef5",
    headerBg: dark ? "#1a1d2e" : "#ffffff",
    uploadBtn: dark ? "#1e2235" : "#edf2ff",
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.filter(m => m.role !== "assistant" || messages.indexOf(m) > 0)
        })
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.response }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "❌ Error connecting to server. Make sure backend is running!" }]);
    }
    setLoading(false);
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API}/upload`, { method: "POST", body: formData });
      const data = await res.json();
      setUploadStatus("✅ " + data.message);
    } catch {
      setUploadStatus("❌ Upload failed");
    }
    setTimeout(() => setUploadStatus(""), 4000);
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: theme.bg, fontFamily: "system-ui, sans-serif", transition: "all 0.3s" }}>
      
      {/* Sidebar */}
      <div style={{ width: 260, background: theme.sidebar, borderRight: `1px solid ${theme.border}`, display: "flex", flexDirection: "column", padding: 20, gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🏦</span>
          <div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 15 }}>BankBot</div>
            <div style={{ fontSize: 11, color: theme.subtext }}>AI Support Assistant</div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: `1px solid ${theme.border}` }} />

        {/* Upload section */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.subtext, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Upload Documents</div>
          <label style={{ display: "block", background: theme.uploadBtn, border: `2px dashed ${theme.border}`, borderRadius: 10, padding: "14px 10px", textAlign: "center", cursor: "pointer", color: theme.subtext, fontSize: 13, transition: "all 0.2s" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>📄</div>
            Click to upload PDF or TXT
            <input type="file" accept=".pdf,.txt" onChange={uploadFile} style={{ display: "none" }} />
          </label>
          {uploadStatus && <div style={{ marginTop: 8, fontSize: 12, color: theme.subtext }}>{uploadStatus}</div>}
        </div>

        <hr style={{ border: "none", borderTop: `1px solid ${theme.border}` }} />

        {/* Quick questions */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.subtext, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Quick Questions</div>
          {["What is a personal loan?", "Credit card interest rates?", "How to apply for a home loan?"].map(q => (
            <button key={q} onClick={() => { setInput(q); }} style={{ display: "block", width: "100%", textAlign: "left", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", marginBottom: 6, cursor: "pointer", color: theme.subtext, fontSize: 12, transition: "all 0.2s" }}
              onMouseEnter={e => e.target.style.background = theme.card}
              onMouseLeave={e => e.target.style.background = "transparent"}>
              💬 {q}
            </button>
          ))}
        </div>

        {/* Theme toggle at bottom */}
        <div style={{ marginTop: "auto" }}>
          <button onClick={() => setDark(!dark)} style={{ width: "100%", padding: "10px 0", background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 10, cursor: "pointer", color: theme.text, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, color: theme.text }}>Banking Support Chat</div>
            <div style={{ fontSize: 12, color: "#4CAF50" }}>● Online</div>
          </div>
          <div style={{ fontSize: 12, color: theme.subtext }}>Powered by Groq + RAG</div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end" }}>
              {msg.role === "assistant" && <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#4c6ef5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>}
              <div style={{ maxWidth: "68%", padding: "12px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? theme.userBubble : theme.botBubble, color: msg.role === "user" ? "#ffffff" : theme.botText, fontSize: 14, lineHeight: 1.6, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                {msg.content}
              </div>
              {msg.role === "user" && <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👤</div>}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#4c6ef5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
              <div style={{ background: theme.botBubble, padding: "14px 18px", borderRadius: "18px 18px 18px 4px" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#4c6ef5", animation: `bounce 1.2s ${i*0.2}s infinite` }}/>)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ background: theme.headerBg, borderTop: `1px solid ${theme.border}`, padding: "16px 24px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", background: theme.input, border: `1.5px solid ${theme.border}`, borderRadius: 14, padding: "6px 6px 6px 16px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask a banking question..."
              style={{ flex: 1, border: "none", background: "transparent", color: theme.text, fontSize: 14, outline: "none", padding: "6px 0" }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: "10px 20px", background: theme.btnPrimary, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14, opacity: loading || !input.trim() ? 0.5 : 1 }}>
              Send ➤
            </button>
          </div>
          <div style={{ fontSize: 11, color: theme.subtext, marginTop: 8, textAlign: "center" }}>Press Enter to send · Upload docs to enable smart answers</div>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
    </div>
  );
}

export default App;