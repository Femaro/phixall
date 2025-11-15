'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { SupportArticle } from './supportKnowledge';
import { loadSupportArticles } from './supportData';

type BotMessage = {
  sender: 'user' | 'assistant' | 'agent';
  text: string;
  createdAt: string;
};

function scoreArticle(article: SupportArticle, query: string, role: string) {
  let score = 0;
  if (article.role === role || article.role === 'general') {
    score += 2;
  }
  const normalizedQuery = query.toLowerCase();
  article.tags.forEach((tag) => {
    if (normalizedQuery.includes(tag)) score += 1;
  });
  if (article.content.toLowerCase().includes(normalizedQuery)) score += 2;
  return score;
}

function retrieveSupportSnippets(articles: SupportArticle[], query: string, role: 'client' | 'artisan' | 'admin') {
  return articles
    .map((article) => ({ article, score: scoreArticle(article, query, role) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => `Title: ${item.article.title}\nContent: ${item.article.content}`);
}

export async function generateSupportReply(params: {
  role: 'client' | 'artisan' | 'admin';
  message: string;
  history: BotMessage[];
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY env variable');
  }

  const articles = await loadSupportArticles(params.role);
  const snippets = retrieveSupportSnippets(articles, params.message, params.role);
  const systemPrompt = `You are Phixall's virtual support assistant. Phixall connects clients with artisans for facility maintenance.
Use the provided knowledge base snippets when possible. Be concise, friendly, and offer step-by-step guidance.
If the user repeatedly asks for a human or you are unsure, set escalationRecommended=true in your response JSON.`;

  const conversation = params.history
    .slice(-6)
    .map((msg) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join('\n');

  const prompt = `
${systemPrompt}

Knowledge Snippets:
${snippets.length ? snippets.join('\n---\n') : 'No direct snippet found.'}

Conversation:
${conversation}
User (${params.role}): ${params.message}

Respond in JSON:
{
  "reply": "friendly answer here",
  "followUp": "optional follow-up question or null",
  "escalationRecommended": true|false
}
`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const completion = await model.generateContent(prompt);
  const raw = completion.response.text();

  try {
    const parsed = JSON.parse(raw) as {
      reply: string;
      followUp?: string | null;
      escalationRecommended?: boolean;
    };
    return {
      reply: parsed.reply || raw,
      followUp: parsed.followUp ?? null,
      escalationRecommended: parsed.escalationRecommended ?? false,
    };
  } catch {
    return {
      reply: raw || 'I’m here to help! Could you please rephrase your question?',
      followUp: null,
      escalationRecommended: false,
    };
  }
}

