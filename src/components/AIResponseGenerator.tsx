'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ModelSelector from '@/components/ModelSelector';
import ResponseDisplay from '@/components/ResponseDisplay';
import { generateAIResponse, humanizeResponse, detectAI } from '@/lib/ai-services';

interface Response {
  original: string;
  humanized: string;
  aiScore: number | null;
}

export default function AIResponseGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<Response>({ original: '', humanized: '', aiScore: null });
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [humanizationStatus, setHumanizationStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setHumanizationStatus('Generating original response...');
    
    try {
      const originalResponse = await generateAIResponse(prompt, selectedModel);
      setResponse(prevResponse => ({ ...prevResponse, original: originalResponse }));
      
      setIsHumanizing(true);
      setHumanizationStatus('Humanizing response...');
      const humanizedResponse = await humanizeResponse(originalResponse);
      
      setHumanizationStatus('Detecting AI...');
      const aiScore = await detectAI(humanizedResponse);

      setResponse({
        original: originalResponse,
        humanized: humanizedResponse,
        aiScore: aiScore,
      });
    } catch (error: unknown) {
      console.error('Error generating response:', error);
      if (error instanceof Error) {
        setHumanizationStatus(`Error: ${error.message}`);
      } else {
        setHumanizationStatus('An unknown error occurred');
      }
    } finally {
      setIsGenerating(false);
      setIsHumanizing(false);
      setHumanizationStatus('');
    }
  };

  return (
    <div className="space-y-6">
      <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 p-2 border rounded-md resize-none"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
              Generating...
            </>
          ) : (
            'Generate Response'
          )}
        </button>
      </form>
      {isGenerating && <div className="text-sm text-gray-500">{humanizationStatus}</div>}
      {response.original && <ResponseDisplay response={response} />}
    </div>
  );
}
