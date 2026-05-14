export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body;

    const message = body?.message || "hello";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5",
        input: message
      })
    });

    // ✅ Handle bad responses
    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({
        error: "OpenAI error",
        details: text
      });
    }

    const data = await response.json();

    const reply =
      data?.output?.[0]?.content?.[0]?.text ||
      "No response";

    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
