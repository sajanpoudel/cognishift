'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Upload, RotateCcw, Eye, EyeOff } from 'lucide-react';
import ModelSelector from '@/components/ModelSelector';
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
}

export default function AIResponseGenerator({ chatId }: AIResponseGeneratorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai');
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
      const aiResponse = await generateAIResponse(input || await file!.text(), selectedModel);
      
      setGenerationProgress(66);
      let humanizedResponse: string;
      if (aiResponse.length < 50) {
        humanizedResponse = "Output needs to be more than 50 characters to humanize.";
      } else {
        humanizedResponse = await humanizeResponse(aiResponse, 50);
      }
      
      setGenerationProgress(90);
      const aiScore = await detectAI(humanizedResponse);
      const originalAiScore = await detectAI(aiResponse);

      const newAiMessage: Message = { 
        type: 'ai', 
        content: aiResponse, 
        humanizedContent: humanizedResponse, 
        aiScore: aiScore,
        originalAiScore: originalAiScore,
        showAI: aiResponse.length < 50 // Show AI text by default if less than 50 characters
      };
      setMessages(prev => [...prev, newAiMessage]);

      saveChatHistory(chatId, [...messages, newUserMessage, newAiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'An error occurred while generating the response.', 
        humanizedContent: 'An error occurred while generating the response.', 
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
      <div className="flex justify-between items-center mb-4">
        <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-lg mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${
              message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}>
              <p>{message.showAI ? message.content : message.humanizedContent}</p>
              {message.type === 'ai' && (
                <>
                  <p className="text-xs mt-2">
                    AI Score: {message.showAI 
                      ? `${(message.originalAiScore * 100).toFixed(2)}%`
                      : `${(message.aiScore * 100).toFixed(2)}%`
                    }
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAIView(index)}
                    className="mt-2"
                  >
                    {message.showAI ? 'Show Humanized' : 'Show AI'}
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {isGenerating && (
        <div className="mb-4">
          <Progress value={generationProgress} className="w-full" />
          <p className="text-sm text-center mt-2">
            {generationProgress < 33 ? 'Generating AI response...' :
             generationProgress < 66 ? 'Humanizing response...' :
             generationProgress < 90 ? 'Verifying AI presence...' : 'Finalizing...'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or upload a file..."
            className="pr-10"
            rows={1}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
        <Button type="button" variant="outline" onClick={() => setMessages([])}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
