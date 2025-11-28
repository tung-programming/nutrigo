const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs').promises;
const path = require('path');

class ChatbotService {
  constructor() {
    // Use your existing Gemini API key
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.knowledgeBase = "";
  }

  async loadKnowledgeBase() {
    const knowledgePath = path.join(__dirname, 'knowledge-base');
    const files = await fs.readdir(knowledgePath);
    
    let content = "";
    for (const file of files) {
      const filePath = path.join(knowledgePath, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      content += `\n\n--- ${file} ---\n${fileContent}`;
    }
    
    this.knowledgeBase = content;
    console.log("Knowledge base loaded successfully");
  }

  async chat(userMessage) {
    const prompt = `You are NutriGo's helpful assistant. You ONLY answer questions based on the knowledge base provided below. If the question is not covered in the knowledge base, respond with: "I don't have information about that. Please contact support or check our documentation."

KNOWLEDGE BASE:
${this.knowledgeBase}

USER QUESTION: ${userMessage}

ANSWER (use only the knowledge base above):`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }
}

module.exports = ChatbotService;
