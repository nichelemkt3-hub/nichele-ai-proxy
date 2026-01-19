import fetch from "node-fetch";

const BASE_CONHECIMENTO = `
Você é um assistente oficial da NICHELE MATERIAIS DE CONSTRUÇÃO.
Responda APENAS com base nas informações abaixo.
Se não encontrar a resposta, diga:
"Não encontrei essa informação. Fale conosco no WhatsApp: (41) 99755-0040"

Pergunta: Até quando vai a campanha?
Resposta: A campanha ocorre de 20/01 a 17/12, com participação até 14/12.

Pergunta: Quais lojas participam?
Resposta: Todas as lojas Nichele Materiais de Construção e Nichele Tintas. Não vale para Vero Acabamentos.

Pergunta: Quem pode participar?
Resposta: Pessoas físicas e jurídicas maiores de 18 anos, com CPF válido e residentes no Brasil.

Pergunta: Quem não pode participar?
Resposta: Menores de 18 anos, pessoas sem CPF válido, não residentes no Brasil e funcionários da empresa.

Pergunta: Como participar?
Resposta: Compras a partir de R$ 2.000,00 e cadastro completo no hotsite ou WhatsApp.

Pergunta: Onde vejo meu número da sorte?
Resposta: Pelo hotsite aniversarionichele.com.br ou WhatsApp.

Pergunta: Ganhei um sorteio, continuo participando?
Resposta: Não. Cada participante pode ser contemplado apenas uma vez.
`;

export default async function handler(req, res) {
  // 🔓 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método não permitido" });

  try {
    const body = req.body || {};
    const pergunta = body.message || body.question;

    if (!pergunta) {
      return res.status(400).json({
        reply:
          "Pergunta não informada. Fale conosco no WhatsApp: (41) 99755-0040",
      });
    }

    // 🔹 Chamada para RapidAPI OpenAI
    const rapidResponse = await fetch(
      "https://openai80.p.rapidapi.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": "openai80.p.rapidapi.com",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          messages: [
            { role: "system", content: BASE_CONHECIMENTO },
            { role: "user", content: pergunta },
          ],
        }),
      }
    );

    const data = await rapidResponse.json();

    const resposta =
      data.choices?.[0]?.message?.content ||
      "Não encontrei essa informação. Fale conosco no WhatsApp: (41) 99755-0040";

    return res.status(200).json({ reply: resposta });
  } catch (err) {
    return res.status(500).json({
      reply:
        "Erro técnico no momento. Fale conosco no WhatsApp: (41) 99755-0040",
    });
  }
}
