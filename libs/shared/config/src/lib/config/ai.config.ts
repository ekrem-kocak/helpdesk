import { registerAs } from '@nestjs/config';

export interface AiConfig {
  geminiApiKey: string;
}

export default registerAs<AiConfig>('ai', () => ({
  geminiApiKey: process.env['GEMINI_API_KEY'] as string,
}));
