import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAIResponse(prompt: string, model: string) {
  if (model === 'openai') {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });
    return completion.choices[0].message.content || '';
  } else if (model === 'gemini') {
    const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } else {
    throw new Error('Invalid model selected');
  }
}

export async function humanizeResponse(text: string, strength: number) {
  if (text.length < 50) {
    return "Output needs to be more than 50 characters to humanize.";
  }

  console.log('Sending request to Undetectable AI:', text);
  const response = await fetch('https://humanize.undetectable.ai/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_UNDETECTABLE_AI_API_KEY || '',
    },
    body: JSON.stringify({
      content: text,
      readability: "High School",
      purpose: "General Writing",
      strength: mapStrengthToAPI(strength),
      language: "English" // Add this line to specify English output
    }),
  });

  const responseData = await response.text();
  console.log('Response from Undetectable AI:', response.status, responseData);

  if (!response.ok) {
    throw new Error(`Failed to humanize response: ${response.status} ${responseData}`);
  }

  const data = JSON.parse(responseData);
  
  // The API returns a document ID, so we need to fetch the result
  return await fetchHumanizedResult(data.id);
}

function mapStrengthToAPI(strength: number): string {
  if (strength < 33) return "Quality";
  if (strength < 66) return "Balanced";
  return "More Human";
}

async function fetchHumanizedResult(documentId: string) {
  // Implement polling logic to check document status
  let retries = 0;
  const maxRetries = 10;
  const retryDelay = 5000; // 5 seconds

  while (retries < maxRetries) {
    const response = await fetch('https://humanize.undetectable.ai/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_UNDETECTABLE_AI_API_KEY || '',
      },
      body: JSON.stringify({ id: documentId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch humanized result: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.output) {
      return data.output;
    }

    // If output is not ready, wait and retry
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    retries++;
  }

  throw new Error('Timed out waiting for humanized result');
}

export async function detectAI(text: string) {
  // Implement GPTZero API call here
  // This is a placeholder implementation
  console.log('Detecting AI in the response');
  // Simulating an AI detection score between 0 and 1
  return Math.random();
}
