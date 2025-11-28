import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs/promises';
import path from 'path';

class ChatbotService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  public knowledgeBase: string;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    this.knowledgeBase = "";
  }

  async loadKnowledgeBase(): Promise<void> {
    try {
      const knowledgePath = path.join(__dirname, '../knowledge-base');
      const files = await fs.readdir(knowledgePath);
      
      let content = "";
      for (const file of files) {
        const filePath = path.join(knowledgePath, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        if (file.endsWith('.json')) {
          const jsonData = JSON.parse(fileContent);
          if (Array.isArray(jsonData)) {
            jsonData.forEach((item: any) => {
              content += `\nQ: ${item.question}\nA: ${item.answer}\n`;
            });
          }
        } else {
          content += `\n\n--- ${file} ---\n${fileContent}`;
        }
      }
      
      this.knowledgeBase = content;
      console.log("✅ Knowledge base loaded successfully");
      console.log(`📚 Loaded ${files.length} file(s) from knowledge base`);
    } catch (error) {
      console.error("❌ Error loading knowledge base:", error);
      throw error;
    }
  }

  async chat(userMessage: string): Promise<string> {
    if (!this.knowledgeBase) {
      throw new Error("Knowledge base not loaded. Please restart the server.");
    }

    const prompt = `You are NutriGo's helpful assistant. You ONLY answer questions based on the knowledge base provided below. 

IMPORTANT RULES:
- Only use information from the knowledge base below
- If the question is not covered in the knowledge base, respond with: "I don't have information about that. Please contact our support team or check the app documentation."
- Be friendly, helpful, and concise
- Never make up information

KNOWLEDGE BASE:
${this.knowledgeBase}

USER QUESTION: ${userMessage}

ANSWER (use only the knowledge base above):`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("❌ Error generating response:", error);
      throw new Error("Failed to generate response. Please try again.");
    }
  }
}

export default ChatbotService;
