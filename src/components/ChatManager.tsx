'use client';

import { useState, useEffect } from 'react';
import AIResponseGenerator from '@/components/AIResponseGenerator';
import Sidebar from '@/components/Sidebar';
import { Menu, X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import ModelSelector from '@/components/ModelSelector';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Chat {
  id: string;
  name: string;
}

interface Folder {
  id: string;
  name: string;
  chats: Chat[];
  isExpanded: boolean;
}

export default function ChatManager() {
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'default', name: 'All Chats', chats: [], isExpanded: true }
  ]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [undetectableApiKey, setUndetectableApiKey] = useState('');
  const [openAIApiKey, setOpenAIApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
      const parsedFolders = JSON.parse(savedFolders);
      setFolders(parsedFolders);
      
      const allChatsFolder = parsedFolders.find((folder: Folder) => folder.id === 'default');
      
      if (allChatsFolder && allChatsFolder.chats.length > 0) {
        setActiveChat(allChatsFolder.chats[0].id);
      } else {
        createNewChat('default');
      }
    } else {
      createNewChat('default');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    // Load API keys from localStorage
    const savedUndetectableApiKey = localStorage.getItem('undetectableApiKey');
    const savedOpenAIApiKey = localStorage.getItem('openAIApiKey');
    const savedGeminiApiKey = localStorage.getItem('geminiApiKey');

    if (savedUndetectableApiKey) setUndetectableApiKey(savedUndetectableApiKey);
    if (savedOpenAIApiKey) setOpenAIApiKey(savedOpenAIApiKey);
    if (savedGeminiApiKey) setGeminiApiKey(savedGeminiApiKey);
  }, []);

  const createNewChat = (folderId: string) => {
    const newChat: Chat = { 
      id: Date.now().toString(), 
      name: `Chat ${folders.find(f => f.id === folderId)?.chats.length! + 1}` 
    };
    setFolders(prevFolders => prevFolders.map(folder => 
      folder.id === folderId 
        ? { ...folder, chats: [...folder.chats, newChat] }
        : folder
    ));
    setActiveChat(newChat.id);
  };

  const saveSettings = () => {
    localStorage.setItem('undetectableApiKey', undetectableApiKey);
    localStorage.setItem('openAIApiKey', openAIApiKey);
    localStorage.setItem('geminiApiKey', geminiApiKey);
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out bg-gray-200 dark:bg-gray-800`}>
        <div className="p-4 flex items-center justify-between">
          <Settings className="h-6 w-6 text-blue-500" />
          {isSidebarOpen && <span className="font-bold text-lg">Cognishift</span>}
        </div>
        <Sidebar 
          folders={folders} 
          setFolders={setFolders} 
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          createNewChat={createNewChat}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg rounded-tl-2xl overflow-hidden flex flex-col">
          <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 dark:text-gray-300"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center space-x-2">
              <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div>
                      <label htmlFor="undetectable-api-key" className="text-sm font-medium">
                        Undetectable AI API Key
                      </label>
                      <Input
                        id="undetectable-api-key"
                        value={undetectableApiKey}
                        onChange={(e) => setUndetectableApiKey(e.target.value)}
                        placeholder="Enter your Undetectable AI API key"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="openai-api-key" className="text-sm font-medium">
                        OpenAI API Key
                      </label>
                      <Input
                        id="openai-api-key"
                        value={openAIApiKey}
                        onChange={(e) => setOpenAIApiKey(e.target.value)}
                        placeholder="Enter your OpenAI API key"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label htmlFor="gemini-api-key" className="text-sm font-medium">
                        Gemini API Key
                      </label>
                      <Input
                        id="gemini-api-key"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={saveSettings} disabled={!openAIApiKey && !geminiApiKey}>
                      Save Settings
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>
          <main className="flex-1 overflow-hidden p-6">
            {activeChat ? (
              <AIResponseGenerator 
                chatId={activeChat} 
                selectedModel={selectedModel}
                undetectableApiKey={undetectableApiKey}
                openAIApiKey={openAIApiKey}
                geminiApiKey={geminiApiKey}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                Select a chat or create a new one to get started
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
