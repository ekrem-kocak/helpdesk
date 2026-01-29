import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AiAnalysis {
  summary: string;
  priority: string;
  category: string;
  suggestedReply: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async analyzeTicket(title: string, description: string): Promise<AiAnalysis> {
    this.logger.log('🤖 Ticket is being analyzed by AI...');

    const prompt = `
      You are a professional IT Support Specialist. Analyze the following support ticket.
      
      Ticket Title: "${title}"
      Ticket Description: "${description}"

      Your tasks:
      1. Summarize the issue in one sentence.
      2. Determine the priority level (LOW, MEDIUM, HIGH).
      3. Guess the category (HARDWARE, SOFTWARE, NETWORK, ACCESS).
      4. Write a polite and solution-oriented short automatic reply suggestion to the user.

      PLEASE ONLY RESPOND IN THE FOLLOWING JSON FORMAT (No Markdown, plain JSON only):
      {
        "summary": "...",
        "priority": "...",
        "category": "...",
        "suggestedReply": "..."
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Gemini sometimes returns JSON in markdown blocks (```json ... ```). Let's clean them up.
      const cleanJson = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      return JSON.parse(cleanJson);
    } catch (error) {
      this.logger.error('AI Analysis failed:', error);
      // Hata olursa varsayılan değer dönelim ki sistem çökmesin
      return {
        summary: 'Analysis failed',
        priority: 'MEDIUM',
        category: 'OTHER',
        suggestedReply: 'We have received your ticket and are analyzing it.',
      };
    }
  }
}
