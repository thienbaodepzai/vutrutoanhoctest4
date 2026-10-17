import { GoogleGenAI } from "@google/genai";

let ai = null;
function getAIClient() {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const systemPrompt = (grade) => `Bạn là MathBot, gia sư Toán THCS (Lớp ${grade}, sách Kết nối tri thức).
Quy tắc:
- Chỉ trả lời câu hỏi về Toán lớp 6-9. Câu ngoài phạm vi thì lịch sự từ chối và gợi ý hỏi về Toán.
- Hướng dẫn TỪNG BƯỚC, đặt câu hỏi gợi mở để học sinh tự làm. Chỉ đưa đáp án cuối khi học sinh đã thử hoặc yêu cầu rõ.
- Tự kiểm tra lại mọi phép tính trước khi trả lời. Nếu không chắc thì nói rõ.
- Dùng tiếng Việt thân thiện, xưng "thầy" và gọi "em". Viết ký hiệu bằng chữ thường: x², √, ≤, ≥, π.
- Không hỏi và không thu thập thông tin cá nhân của học sinh.`;

export default async function handler(req, res) {
  // 1. Set standard CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");

  // 2. Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 3. Handle Health Check (GET or query/path health)
  if (req.method === "GET" || req.query?.health || req.url?.includes('/health')) {
    const client = getAIClient();
    const hasKey = !!process.env.GEMINI_API_KEY;
    if (!hasKey) {
      return res.status(200).json({
        status: "offline",
        online: false,
        message: "GEMINI_API_KEY chưa được cấu hình trên Vercel. Vui lòng thêm biến môi trường GEMINI_API_KEY trong Project Settings -> Environment Variables trên Vercel."
      });
    }
    return res.status(200).json({
      status: "online",
      online: true,
      message: "MathBot AI đang trực tuyến và sẵn sàng kết nối với Google Gemini."
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Chỉ hỗ trợ phương thức POST và GET" });
  }

  const { message, grade = 6, history = [], image } = req.body || {};
  if (!message || typeof message !== "string" || message.length > 2000) {
    return res.status(400).json({ error: "Câu hỏi không hợp lệ hoặc vượt quá 2000 ký tự" });
  }

  const client = getAIClient();
  if (!client) {
    return res.status(500).json({
      error: "GEMINI_API_KEY chưa được cấu hình trên Vercel. Vui lòng thêm biến môi trường GEMINI_API_KEY trong Vercel Dashboard."
    });
  }

  const start = history.findIndex((h) => h.role === "user");
  const past = start === -1 ? [] : history.slice(start);
  const contents = [
    ...past.map((h) => ({ role: h.role, parts: [{ text: h.content }] })),
    {
      role: "user",
      parts: [
        ...(image ? [{ inlineData: { mimeType: image.mimeType, data: image.data } }] : []),
        { text: message },
      ],
    },
  ];

  try {
    const r = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction: systemPrompt(grade), temperature: 0.3 },
    });
    return res.status(200).json({ reply: r.text });
  } catch (e) {
    console.error("MathBot Error:", e);
    return res.status(502).json({
      error: "MathBot tạm thời quá tải hoặc API Key không hợp lệ. Vui lòng kiểm tra lại GEMINI_API_KEY trên Vercel."
    });
  }
}
