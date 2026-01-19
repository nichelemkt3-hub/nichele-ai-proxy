export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { question, base } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é o assistente oficial da campanha Aniversário Nichele.
Responda SOMENTE usando a base abaixo.
Se não encontrar a resposta, diga:
"Não encontrei essa informação. Fale conosco no WhatsApp 41 99755-0040."

BASE:
${base}`
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0
      })
    });

    const data = await response.json();

    res.status(200).json({
      answer: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({
      error: "Erro ao consultar a IA"
    });
  }
}
