import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkWebsite = async () => {
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://website-visitor-1.onrender.com/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ status: "error", message: err.message });
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>🌐 Website Status Checker</h1>

      <input
        type="text"
        placeholder="Enter https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "300px", padding: "8px", marginRight: "10px" }}
      />

      <button onClick={checkWebsite} disabled={loading}>
        {loading ? "Checking..." : "Check"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p><b>Status:</b> {result.status}</p>
          {result.response_time && (
            <p><b>Response Time:</b> {result.response_time} ms</p>
          )}
          <p><b>Message:</b> {result.message || result.error}</p>
        </div>
      )}
    </div>
  );
}

export default App;