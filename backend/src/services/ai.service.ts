import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export class AIService {
  /**
   * AI Legal Chat Assistant
   */
  public static async chatAssistant(
    history: { role: string; parts: { text: string }[] }[],
    message: string
  ): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: `You are AdhikarAI, an empathetic AI legal companion designed for women across India. 
Explain laws under the Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS) and other relevant acts (like the Domestic Violence Act, DPDP Act, etc.) in simple, plain language. 
Always cite specific articles and sections where appropriate. 
Answer in the language of the user's prompt (English, Hindi, Bengali, etc.). Keep it clear, concise, and helpful.`
      });

      const chat = model.startChat({
        history: history
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (err) {
      logger.error('Gemini chat assistant failed:', err);
      throw new Error('AI Chat service is temporarily unavailable.');
    }
  }

  /**
   * Legal Notice Generator
   */
  public static async generateNotice(
    subject: string,
    senderName: string,
    senderAddress: string,
    recipientName: string,
    recipientAddress: string,
    details: string
  ): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an expert legal advisor in India. Draft a formal legal notice in clean HTML format based on these details:
- Subject: ${subject}
- Sender: ${senderName}, residing at ${senderAddress}
- Recipient: ${recipientName}, residing at ${recipientAddress}
- Dispute details and dates: ${details}

The notice must:
1. Be highly professional, legally structured, and state specific sections of BNS/IPC/CrPC where applicable.
2. Render directly inside a div, without enclosing markdown tags like \`\`\`html or similar.
3. Use simple, readable headings, paragraphs, and lists.
4. Leave clean placeholder slots for signatures and lawyer information.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      // Strip any accidental markdown formatting
      return response.text().replace(/```html|```/g, '').trim();
    } catch (err) {
      logger.error('Gemini notice generation failed:', err);
      throw new Error('AI Notice drafting is temporarily unavailable.');
    }
  }

  /**
   * Legal Text Summarizer
   */
  public static async summarizeLegalText(text: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Act as an expert legal summarizer. Summarize the following legal document or text in simple, plain language. 
Highlight the main facts, key arguments, court decision (if any), and its practical implications for the citizen. Keep it highly readable and clean:

${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      logger.error('Gemini summarizer failed:', err);
      throw new Error('AI Summarizer service is temporarily unavailable.');
    }
  }

  /**
   * Document OCR Reader
   */
  public static async ocrImage(imageBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType
        }
      };

      const prompt = `Read and transcribe the text inside this document image exactly as it appears. 
If the text is in regional languages, write it down accurately in that language. 
Do not add any explanations or commentary; return only the transcribed text.`;

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (err) {
      logger.error('Gemini OCR processing failed:', err);
      throw new Error('AI Document Reader (OCR) is temporarily unavailable.');
    }
  }

  /**
   * Multi-language Translation
   */
  public static async translate(text: string, targetLanguage: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Translate the following text accurately into ${targetLanguage}. 
Maintain the legal structure, context, and semantic meaning perfectly. Do not paraphrase or add extra comments:

${text}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      logger.error('Gemini translation failed:', err);
      throw new Error('AI Translation service is temporarily unavailable.');
    }
  }
}
export default AIService;
