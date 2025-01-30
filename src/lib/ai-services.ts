import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const cache = new Map();

export async function generateAIResponse(
  prompt: string, 
  model: string, 
  openAIApiKey: string, 
  geminiApiKey: string
) {
  const cacheKey = `generateAIResponse-${model}-${prompt}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  let response;
  if (model === 'openai') {
    if (!openAIApiKey) throw new Error('OpenAI API key is not set');
    const openai = new OpenAI({ apiKey: openAIApiKey, dangerouslyAllowBrowser: true });
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    response = completion.choices[0].message.content;
  } else if (model === 'gemini') {
    if (!geminiApiKey) throw new Error('Gemini API key is not set');
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt);
     response = await result.response;
    response = response.text();
  } else {
    throw new Error('Invalid model selected');
  }

  cache.set(cacheKey, response);
  return response;
}

export async function humanizeResponse(text: string, apiKey: string, strength: number = 50) {
  const cacheKey = `humanizeResponse-${text}-${strength}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (text.length < 50) {
    return "Output needs to be more than 50 characters to humanize.";
  }

  console.log('Sending request to Undetectable AI:', text);
  const response = await fetch('https://humanize.undetectable.ai/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey,
    },
    body: JSON.stringify({
      content: text,
      readability: "High School",
      purpose: "General Writing",
      strength: mapStrengthToAPI(strength),
      language: "English"
    }),
  });
    
  const responseData = await response.text();
  console.log('Response from Undetectable AI:', response.status, responseData);
    
  if (!response.ok) {
    throw new Error(`Failed to humanize response: ${response.status} ${responseData}`);
    }
    
  const data = JSON.parse(responseData);

  // The API returns a document ID, so we need to fetch the result
  const humanizedResult = await fetchHumanizedResult(data.id, apiKey);
  cache.set(cacheKey, humanizedResult);
  return humanizedResult;
}

function mapStrengthToAPI(strength: number): string {
  if (strength < 33) return "Quality";
  if (strength < 66) return "Balanced";
  return "More Human";
}

async function fetchHumanizedResult(documentId: string, apiKey: string) {
  let retries = 0;
  const maxRetries = 10;
  const retryDelay = 2000; // 2 seconds

  while (retries < maxRetries) {
    const response = await fetch('https://humanize.undetectable.ai/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
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

export async function detectAI(text: string, saplingApiKey: string) {
  const cacheKey = `detectAI-${text}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const response = await fetch('https://api.sapling.ai/api/v1/aidetect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: saplingApiKey,
      text: text
    }),
  });

  if (!response.ok) {
    throw new Error(`Sapling AI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Sapling AI returns a score between 0 and 1, where 1 is most likely AI-generated
  const aiScore = data.score;
  cache.set(cacheKey, aiScore);
  return aiScore;
}
