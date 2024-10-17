'use client';

import { useState, useEffect } from 'react';
import AIResponseGenerator from '@/components/AIResponseGenerator';
import Sidebar from '@/components/Sidebar';

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

  useEffect(() => {
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
      const parsedFolders = JSON.parse(savedFolders);
      setFolders(parsedFolders);
      
      // Find the "All Chats" folder
      const allChatsFolder = parsedFolders.find((folder: Folder) => folder.id === 'default');
      
      if (allChatsFolder && allChatsFolder.chats.length > 0) {
        // Set the first chat in "All Chats" as active
        setActiveChat(allChatsFolder.chats[0].id);
      } else {
        // If no chats exist, create a new one
        createNewChat('default');
      }
    } else {
      // If no folders exist, create a new chat in the default folder
      createNewChat('default');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

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

  return (
    <div className="flex h-full">
      <Sidebar 
        folders={folders} 
        setFolders={setFolders} 
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        createNewChat={createNewChat}
      />
      <div className="flex-1 p-6">
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
