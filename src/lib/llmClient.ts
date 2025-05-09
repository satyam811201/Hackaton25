export async function getLLMResponse(chapterName: string) {
    console.log("Sending to backend:", JSON.stringify({ chapterName })); // ADD THIS LINE
    const res = await fetch("/api/get-topic-context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterName }),
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch data from LLM.");
    }
  
    return res.json();
  }