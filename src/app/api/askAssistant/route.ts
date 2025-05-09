
export async function POST(req: Request) {
    const { messages: newMessages } = await req.json();
  
    const systemPrompt = {
      role: "system",
      content: "You are a helpful AI assistant for math students. Please only answer questions related to mathematics. If a question is not about math, politely decline to answer and suggest asking a math-related question."
    };
  
    const messagesWithContext = [systemPrompt, ...newMessages];
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Maths AI Assistant"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: messagesWithContext
        })
      });
  
      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      return Response.json({ reply });
    } catch (error) {
      console.error("Error calling OpenRouter API:", error);
      return Response.json({ reply: "An error occurred while processing your request." }, { status: 500 });
    }
  }