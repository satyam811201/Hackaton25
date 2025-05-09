import { useState } from "react";

export function useAIAssistant() {
  const [aiHelp, setAiHelp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAIAssistance = async (topic: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/get-topic-context", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setAiHelp(data);
    } catch (err) {
      setError("Failed to fetch AI help. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return { aiHelp, loading, error, fetchAIAssistance };
}
