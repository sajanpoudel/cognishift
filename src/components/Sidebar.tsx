'use client';

import { useState, useEffect } from 'react';
import { Folder, ChevronRight, ChevronDown, ChevronLeft, Plus, MessageSquare, Settings, Edit2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from '@/components/StrictModeDroppable';

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

interface SidebarProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
  createNewChat: (folderId: string) => void;
}

export default function Sidebar({ folders, setFolders, activeChat, setActiveChat, createNewChat }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
      const parsedFolders: Folder[] = JSON.parse(savedFolders);
      // Ensure the default folder always exists
      if (!parsedFolders.some((folder: Folder) => folder.id === 'default')) {
        parsedFolders.unshift({ id: 'default', name: 'All Chats', chats: [], isExpanded: true });
      }
      setFolders(parsedFolders);
    } else {
      // If no folders exist, create the default folder
      setFolders([{ id: 'default', name: 'All Chats', chats: [], isExpanded: true }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId ? { ...folder, isExpanded: !folder.isExpanded } : folder
    ));
  };

  const addFolder = () => {
    const folderNumbers = folders
      .map(folder => {
        const match = folder.name.match(/^Folder (\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);

    const nextNumber = folderNumbers.length > 0 ? Math.max(...folderNumbers) + 1 : 1;

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: `Folder ${nextNumber}`,
      chats: [],
      isExpanded: false,
    };
    setFolders([...folders, newFolder]);
  };

  const addChat = (folderId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        const newChat: Chat = {
          id: Date.now().toString(),
          name: `New Chat ${folder.chats.length + 1}`,
        };
        return { ...folder, chats: [...folder.chats, newChat] };
      }
      return folder;
    }));
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const finishEditing = () => {
    if (editingId) {
      setFolders(folders.map(folder => {
        if (folder.id === editingId) {
          return { ...folder, name: editingName };
        }
        return {
          ...folder,
          chats: folder.chats.map(chat => 
            chat.id === editingId ? { ...chat, name: editingName } : chat
          )
        };
      }));
    }
    setEditingId(null);
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // If the item was dropped outside a droppable area
    if (!destination) return;

    // If the item was dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the source and destination folders
    const sourceFolder = folders.find(f => f.id === source.droppableId);
    const destFolder = folders.find(f => f.id === destination.droppableId);

    if (!sourceFolder || !destFolder) return;

    // Create a new array of folders
    const newFolders = [...folders];

    // Remove the chat from the source folder
    const [movedChat] = sourceFolder.chats.splice(source.index, 1);

    // Add the chat to the destination folder
    destFolder.chats.splice(destination.index, 0, movedChat);

    // Update the folders state
    setFolders(newFolders);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`p-4 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
        
        
        {isExpanded && (
          <>
            <Button 
              onClick={addFolder} 
              variant="outline" 
              className="mb-4 w-full flex items-center justify-start"
            >
              <Folder className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            
            {folders.map(folder => (
              <StrictModeDroppable key={folder.id} droppableId={folder.id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <div className="mb-1">
                      <div
                        onClick={() => toggleFolder(folder.id)}
                        className="flex items-center w-full p-2 hover:bg-accent rounded-md cursor-pointer"
                      >
                        {folder.isExpanded ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                        <Folder className="mr-2 h-4 w-4" />
                        {editingId === folder.id ? (
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={finishEditing}
                            onKeyPress={(e) => e.key === 'Enter' && finishEditing()}
                            className="w-full"
                          />
                        ) : (
                          <>
                            <span className="flex-grow">{folder.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(folder.id, folder.name);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                createNewChat(folder.id);
                              }}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                      
                      {folder.isExpanded && (
                        <div className="ml-4 mt-2">
                          {folder.chats.map((chat, index) => (
                            <Draggable key={chat.id} draggableId={chat.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`flex items-center w-full py-1 px-2 mb-1 rounded-md cursor-pointer ${
                                    activeChat === chat.id ? "bg-accent" : "hover:bg-accent"
                                  }`}
                                  onClick={() => setActiveChat(chat.id)}
                                >
                                  <MessageSquare className="mr-2 h-3.5 w-3.5" />
                                  {editingId === chat.id ? (
                                    <Input
                                      value={editingName}
                                      onChange={(e) => setEditingName(e.target.value)}
                                      onBlur={finishEditing}
                                      onKeyPress={(e) => e.key === 'Enter' && finishEditing()}
                                      className="w-full text-sm py-0"
                                    />
                                  ) : (
                                    <>
                                      <span className="flex-grow text-sm truncate">{chat.name}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-0 h-5 w-5 min-w-5"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          startEditing(chat.id, chat.name);
                                        }}
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </StrictModeDroppable>
            ))}
            
            <Button variant="ghost" className="w-full justify-start mt-4">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </>
        )}
      </div>
    </DragDropContext>
  );
}
