'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Upload } from 'lucide-react';
import { generateAIResponse, humanizeResponse, detectAI } from '@/lib/ai-services';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface Message {
  type: 'user' | 'ai';
  content: string;
  humanizedContent: string;
  aiScore: number;
  originalAiScore: number;
  showAI: boolean;
}

interface AIResponseGeneratorProps {
  chatId: string;
  selectedModel: string;
  undetectableApiKey: string;
  openAIApiKey: string;
  geminiApiKey: string;
  saplingApiKey: string;
}

export default function AIResponseGenerator({ 
  chatId, 
  selectedModel, 
  undetectableApiKey,
  openAIApiKey,
  geminiApiKey,
  saplingApiKey
}: AIResponseGeneratorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadChatHistory(chatId);
  }, [chatId]);

  const loadChatHistory = (chatId: string) => {
    const savedMessages = localStorage.getItem(`chat_${chatId}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([]);
    }
  };

  const saveChatHistory = (chatId: string, messages: Message[]) => {
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    const newUserMessage: Message = { 
      type: 'user', 
      content: input || `[File: ${file?.name}]`, 
      humanizedContent: input || `[File: ${file?.name}]`, 
      aiScore: 0, 
      originalAiScore: 0, 
      showAI: false 
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setFile(null);

    try {
      setGenerationProgress(33);
      const aiResponse = await generateAIResponse(
        input || (file ? await file.text() : ''),
        selectedModel, 
        openAIApiKey || '',
        geminiApiKey || ''
      );
      
      if (!aiResponse) {
        throw new Error('Failed to generate AI response');
      }
      
      setGenerationProgress(66);
      let humanizedResponse: string;
      try {
        humanizedResponse = await humanizeResponse(aiResponse, undetectableApiKey, 50); // 50 is the default strength
      } catch (humanizeError) {
        console.error('Error humanizing response:', humanizeError);
        humanizedResponse = "Failed to humanize the AI response. Using original response.";
      }
      
      setGenerationProgress(90);
      const aiScore = await detectAI(humanizedResponse, saplingApiKey);
      const originalAiScore = await detectAI(aiResponse, saplingApiKey);

      const newAiMessage: Message = { 
        type: 'ai', 
        content: aiResponse, 
        humanizedContent: humanizedResponse, 
        aiScore: aiScore,
        originalAiScore: originalAiScore,
        showAI: false 
      };
      setMessages(prev => [...prev, newAiMessage]);

      saveChatHistory(chatId, [...messages, newUserMessage, newAiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'An error occurred while generating the response. Please check your API keys and try again.', 
        humanizedContent: 'An error occurred while generating the response. Please check your API keys and try again.', 
        aiScore: 0, 
        originalAiScore: 0, 
        showAI: false 
      }]);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(100);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const toggleAIView = (index: number) => {
    setMessages(prev => prev.map((msg, i) => 
      i === index ? { ...msg, showAI: !msg.showAI } : msg
    ));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type === 'user' ? 'message-user' : 'message-ai'}`}>
            <p>{message.showAI ? message.content : message.humanizedContent}</p>
            {message.type === 'ai' && (
              <>
                <p className="text-xs mt-2 opacity-75">
                  AI Score: {message.showAI 
                    ? `${(message.originalAiScore * 100).toFixed(2)}%`
                    : `${(message.aiScore * 100).toFixed(2)}%`
                  }
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAIView(index)}
                  className="mt-2 text-xs"
                >
                  {message.showAI ? 'Show Humanized' : 'Show AI'}
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      {isGenerating && (
        <div className="p-4">
          <Progress value={generationProgress} className="w-full" />
          <p className="text-sm text-center mt-2 text-gray-600 dark:text-gray-400">
            {generationProgress < 33 ? 'Generating AI response...' :
             generationProgress < 66 ? 'Humanizing response...' :
             generationProgress < 90 ? 'Verifying AI presence...' : 'Finalizing...'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or upload a file..."
            className="input-primary pr-24 resize-none"
            rows={3}
          />
          <div className="absolute right-2 bottom-2 flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="btn-primary"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </form>
    </div>
  );
}
