'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIResponseGenerator from "@/components/AIResponseGenerator";

interface Chat {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const createNewChat = () => {
    const newChat = { id: Date.now().toString(), name: `Chat ${chats.length + 1}` };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  return (
    <div className="flex h-full">
      <div className="w-64 border-r p-4">
        <Button onClick={createNewChat} className="w-full mb-4">
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
        <div className="space-y-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={activeChat === chat.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveChat(chat.id)}
            >
              {chat.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        {activeChat ? (
          <AIResponseGenerator chatId={activeChat} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a chat or create a new one to get started
          </div>
        )}
      </div>
    </div>
  );
}
