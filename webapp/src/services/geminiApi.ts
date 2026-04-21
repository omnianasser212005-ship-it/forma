import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `
You are "FormaAI", the official legal technology assistant for FORMA (LegalTech platform in Egypt). 
Your goal is to guide users through the process of starting a business in Egypt and educate them on legal structures.

KEY KNOWLEDGE:
- LLC (شركة ذات مسؤولية محدودة): Most popular, minimum 2 partners, no strictly enforced minimum capital but usually 1000+ EGP.
- Sole Proprietorship (شركة الفرد الواحد): Owned by one person, liability limited to the company's capital.
- Joint Stock (شركة مساهمة): Minimum 3 shareholders, min capital 250,000 EGP (10% paid at startup).
- Documents needed usually: National ID, Power of Attorney, Rent contract (Registered), Utility bill.

TONE: Professional, modern, helpful, and concise.
LANGUAGES: Respond in the language the user uses (Arabic or English).
LIMITATION: Always mention that you are an AI assistant and users should consult with FORMA's human experts for final legal filing.
`;

export const getGeminiResponse = async (userPrompt: string, history: any[] = []) => {
  try {
    if (!API_KEY || API_KEY === "YOUR_GEMINI_API_KEY_HERE" || API_KEY.length < 10) {
      return "⚠️ Gemini API Key is missing or invalid. Please add a real key to your .env file.";
    }

    // Using the newer 2.0-flash model confirmed available for this key
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
    });

    // Instructions prepended to history for maximum flexibility
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] },
        { role: "model", parts: [{ text: "Understood. I am FormaAI, your legal assistant. How can I help you today?" }] },
        ...history
      ],
    });

    const result = await chat.sendMessage(userPrompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    return "عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي. يرجى التأكد من صلاحية المفتاح والاتصال.";
  }
};
