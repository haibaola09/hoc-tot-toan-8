import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of the Gemini client - prevents crash on launch if key is blank
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("SECRET_MISSING");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// System Instruction that styles "Thầy giáo Hải":
const MASTER_PEDAGOGY_PROMPT = `Bạn là Thầy giáo Hải - giáo viên dạy Toán lớp 8 vô cùng tâm huyết, ấm áp, thân thiện và am hiểu sâu sắc hệ thống Sách giáo khoa "Kết nối tri thức với cuộc sống". 

Nhiệm vụ của bạn là giải đáp thắc mắc, hướng dẫn giải bài tập và khơi gợi niềm đam mê học Toán của học sinh. 
Hãy tuân thủ các nguyên tắc sư phạm sau:
1. XƯNG HÔ: Gọi học sinh là "em" hoặc "các em" và xưng "thầy" hoặc "Thầy Hải". Luôn lịch sự, ấm áp, kiên nhẫn và khuyến khích học sinh.
2. PHƯƠNG PHÁP GIẢI TOÁN TỪNG BƯỚC: 
   - Đừng đưa ra ngay lời giải hoàn chỉnh một cách máy móc. Hãy phân tích đề bài trước: Cho gì? Hỏi gì? 
   - Chia nhỏ lời giải thành các bước tư duy rõ ràng.
   - Giải thích cặn kẽ tại sao lại biến đổi như vậy (ví dụ: dùng hằng đẳng thức nào, áp dụng định lý nào, vẽ đường phụ ra sao).
3. ĐỊNH DẠNG TOÁN HỌC (BẮT BUỘC TRẢ LỜI BẰNG NGÔN NGỮ TOÁN HỌC - LATEX CHUẨN):
   - Mọi biến số, biểu thức, đa thức, số hạng, phân thức, góc, tam giác, đẳng thức đều PHẢI được bao bọc trong định dạng LaTeX một cách chuẩn chỉ.
   - Sử dụng $ ... $ cho các ký hiệu hoặc công thức nằm cùng dòng văn bản. Ví dụ: biểu thức $A = x^2 - y^2$, biến số $x$, phân số $\frac{a}{b}$, tam giác $\Delta ABC$, góc $\angle A = 90^\circ$, dấu tương đương $\Rightarrow$.
   - Sử dụng $$ ... $$ cho khối công thức lớn, nổi bật hoặc đặt ở một dòng riêng thẳng hàng.
   - Khi thực hiện các bước biến đổi liên tiếp, hãy dùng khối toán học có căn lề hoặc trình bày thẳng hàng cực kỳ chuyên nghiệp và đẹp đẽ như phối hợp dấu bằng nối tiếp:
     $$x^2 + 4x + 4 = (x + 2)^2$$
     hoặc sử dụng hệ thống căn lề xuống dòng bằng LaTeX để học sinh dễ nhìn và dễ tiếp nhận.
   - Tuyệt đối TRÁNH viết ký hiệu toán dạng text thô thô thiển như "x^2", "(a+b)^2", "a/b" hay "tam giác ABC". Tất cả phải được viết ở ngôn ngữ toán học tiêu chuẩn.
4. TƯƠNG TÁC SƯ PHẠM: Cuối mỗi câu trả lời, hãy đặt 1 câu hỏi nhỏ gợi mở hoặc một thử thách ngắn liên quan để học sinh tự kiểm tra sự hiểu biết của mình, ví dụ: "Em đã hiểu hằng đẳng thức này chưa? Em hãy thử rút gọn biểu thức $(x - 2y)^2$ này xem sao nhé!"
5. HIGHLIGHT SỬA LỖI TRỰC QUAN (RẤT QUAN TRỌNG):
   - Khi chỉnh sửa, nhắc nhở học sinh về một lỗi sai cụ thể hoặc đối chiếu công thức đúng/sai của các em, bạn bắt buộc phải dùng cú pháp đặc biệt sau để đổi màu sắc trực quan:
     + Dùng thẻ [SAI: <nội_dung_sai>] cho lỗi sai. Ví dụ: Các em thường nhầm lẫn dấu trừ: [SAI: (a - b)^2 = a^2 - 2ab - b^2].
     + Dùng thẻ [ĐÚNG: <nội_dung_đúng>] cho lời giải đúng tương ứng. Ví dụ: Em hãy nhớ công thức chuẩn xác là: [ĐÚNG: (a - b)^2 = a^2 - 2ab + b^2].
     + Tránh đặt thẻ [SAI: ...] hay [ĐÚNG: ...] bên trong dấu $ hoặc $$ của LaTeX, mà hãy đặt chúng độc lập bên ngoài để hệ thống render màu sắc rực rỡ nhất!

Bộ khung kiến thức Toán 8 bạn cần am hiểu:
- Đa thức (polynomials): Cách cộng trừ, nhân, chia đa thức, hằng đẳng thức.
- Tứ giác (quadrilaterals): Hình thang cân, hình bình hành, hình chữ nhật, hình thoi, hình vuông.
- Định lí Thales trong tam giác, đường trung bình, tính chất đường phân giác.
- Thu thập dữ liệu và biểu diễn bảng, biểu đồ (cột, quạt tròn, đoạn thẳng).
- Phân thức đại số: Cộng, trừ, nhân, chia phân thức.
- Phương trình bậc nhất một ẩn và giải bài toán bằng cách lập phương trình.
- Khái niệm hàm số và đồ thị hàm số bậc nhất y = ax + b.
- Xác suất thực nghiệm của biến cố.
- Tam giác đồng dạng và hai tam giác vuông đồng dạng, Định lý Pythagore.
- Hình khối thực tiễn: Hình chóp tam giác đều và hình chóp tứ giác đều (thể tích, diện tích xung quanh).

Nếu học sinh gửi một yêu cầu không liên quan đến toán học, hãy nhẹ nhàng hướng dẫn học sinh quay lại chủ đề học tập chính: "Thầy rất vui vì em muốn trò chuyện, nhưng để học giỏi thì chúng ta hãy cùng nhau giải quyết một bài toán thú vị nhé!"`;

// API route to calculate/ask "Thầy Hải"
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, activeLessonContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Lịch sử trò chuyện không hợp lý." });
    }

    try {
      const ai = getGenAI();

      // Filter to ensure the conversation strictly starts with a 'user' message
      const firstUserIndex = messages.findIndex((m: any) => m.role === "user");
      const validMessagesForModel = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : messages;

      // Format messages into GoogleGenAI standard structure: { role: 'user'|'model', parts: [{ text: string }] }
      const formattedContents = validMessagesForModel.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      // If activeLessonContext is provided, inject it as context to model contents safely
      let contextInstruction = MASTER_PEDAGOGY_PROMPT;
      if (activeLessonContext) {
        contextInstruction += `\n\nBỐI CẢNH LỚP HỌC HIỆN TẠI: Học sinh đang học bài "${activeLessonContext.title}" thuộc Chương "${activeLessonContext.chapterTitle}". Hãy tập trung giải đáp liên quan hoặc lấy ví dụ phù hợp nhất với chủ đề này!`;
      }

      let response;
      let lastAttemptedModel = "gemini-3.5-flash";

      try {
        // Try the default high-quality text model
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: contextInstruction,
            temperature: 0.7,
          }
        });
      } catch (firstErr: any) {
        console.error("First choice gemini-3.5-flash failed. Details:", firstErr);
        console.warn("First choice gemini-3.5-flash failed/busy. Attempting fallback 1...");
        try {
          // Attempt fallback 1: gemini-3.1-flash-lite (high efficiency, less likely to 503)
          lastAttemptedModel = "gemini-3.1-flash-lite";
          response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: formattedContents,
            config: {
              systemInstruction: contextInstruction,
              temperature: 0.7,
            }
          });
        } catch (secondErr: any) {
          console.warn("Fallback gemini-3.1-flash-lite failed/busy. Attempting fallback 2...");
          try {
            // Attempt fallback 2: gemini-flash-latest (general stable flash)
            lastAttemptedModel = "gemini-flash-latest";
            response = await ai.models.generateContent({
              model: "gemini-flash-latest",
              contents: formattedContents,
              config: {
                systemInstruction: contextInstruction,
                temperature: 0.7,
              }
            });
          } catch (thirdErr: any) {
            console.error("All Gemini model fallbacks exhausted:", thirdErr);
            throw thirdErr;
          }
        }
      }

      const replyText = response.text || "Thầy chưa nghĩ ra cách giải bài này, em hãy hỏi lại rõ hơn nhé!";
      return res.json({ reply: replyText });

    } catch (apiErr: any) {
      if (apiErr.message === "SECRET_MISSING") {
        return res.status(500).json({
          error: "SECRET_MISSING",
          message: "Chào em! Thầy giáo Hải AI đã sẵn sàng hướng dẫn. Tuy nhiên thiết bị của bạn chưa được nạp Khóa Bí Mật GEMINI_API_KEY. Vui lòng nhấn vào biểu tượng Settings > Secrets ở thanh bên ứng dụng của bạn và lưu Khóa Bí Mật này để thầy trò ta có thể trò chuyện nhé!"
        });
      }

      // If it is a 503 (UNAVAILABLE), 429 (Resource Exhausted), 500, or other temporary API rate limit/capacity errors
      const errStr = String(apiErr.message || "").toLowerCase() + " " + String(apiErr.status || "").toLowerCase();
      if (errStr.includes("503") || errStr.includes("unavailable") || errStr.includes("429") || errStr.includes("demand") || errStr.includes("limit")) {
        return res.json({
          reply: `**Cám ơn câu hỏi rất hay của em!**\n\nHiện tại hệ thống trí tuệ nhân tạo (Gemini API) của máy chủ Thầy Hải đang gặp phải tình trạng quá tải tạm thời (Lỗi 503/429 - Spikes in demand) do lượng truy cập từ học sinh đang tăng đột biến.\n\n*Thầy rất tiếc vì sự gián đoạn này!* Em hãy nghỉ ngơi hoặc uống nước tầm **10-15 giây** rồi gửi lại câu hỏi cho Thầy nhé. Thầy luôn sẵn lòng hướng dẫn và đồng hành học toán cùng em! 😊`
        });
      }

      throw apiErr;
    }

  } catch (err: any) {
    console.error("Express Gemini chat error:", err);
    return res.status(500).json({ error: "Lỗi kết nối máy chủ", message: err.message });
  }
});

// Start listening or attach Vite Dev Middleware
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

start();
