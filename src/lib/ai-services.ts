import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAIResponse(
  prompt: string, 
  model: string, 
  openAIApiKey: string, 
  geminiApiKey: string
) {
  if (model === 'openai') {
    if (!openAIApiKey) throw new Error('OpenAI API key is not set');
    // Implement OpenAI API call here
  } else if (model === 'gemini') {
    if (!geminiApiKey) throw new Error('Gemini API key is not set');
    // Implement Gemini API call here
  } else {
    throw new Error('Invalid model selected');
  }

  // Placeholder return
  return `This is a generated response for the prompt: "${prompt}" using ${model} model.`;
}

export async function humanizeResponse(text: string, apiKey: string) {
  if (text.length < 50) {
    return "Output needs to be more than 50 characters to humanize.";
  }

  console.log('Sending request to Undetectable AI:', text);
  const response = await fetch('https://api.undetectable.ai/v2/rewrite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify({
      input: text,
      mode: 'human',
      tone: 'neutral',
      length: 'auto',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to humanize response');
  }

  const data = await response.json();
  return data.output;
}

export async function detectAI(text: string) {
  // Implement GPTZero API call here
  // This is a placeholder implementation
  console.log('Detecting AI in the response');
  // Simulating an AI detection score between 0 and 1
  return Math.random();
}
