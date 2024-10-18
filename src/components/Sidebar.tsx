'use client';

import { useState, useEffect, useCallback } from 'react';
import { Folder, ChevronRight, ChevronDown, MessageSquare, Edit2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
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
  isOpen: boolean;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  activeChat: string | null;
  setActiveChat: (chatId: string) => void;
  createNewChat: (folderId: string) => void;
}

export default function Sidebar({ isOpen, folders, setFolders, activeChat, setActiveChat, createNewChat }: SidebarProps) {
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
    }
  }, [setFolders]); // Add setFolders to the dependency array

  useEffect(() => {
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [folders]);

  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prevFolders => prevFolders.map(folder => 
      folder.id === folderId ? { ...folder, isExpanded: !folder.isExpanded } : folder
    ));
  }, [setFolders]);

  const addFolder = useCallback(() => {
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
    setFolders(prevFolders => [...prevFolders, newFolder]);
  }, [folders, setFolders]);

  const startEditing = useCallback((id: string, name: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingId(id);
    setEditingName(name);
  }, []);

  const finishEditing = useCallback(() => {
    if (editingId) {
      setFolders(prevFolders => prevFolders.map(folder => {
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
    setEditingName('');
  }, [editingId, editingName, setFolders]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setFolders(prevFolders => {
      const newFolders = [...prevFolders];
      const sourceFolder = newFolders.find(f => f.id === source.droppableId);
      const destFolder = newFolders.find(f => f.id === destination.droppableId);

      if (!sourceFolder || !destFolder) return prevFolders;

      const [movedChat] = sourceFolder.chats.splice(source.index, 1);
      destFolder.chats.splice(destination.index, 0, movedChat);

      return newFolders;
    });
  }, [setFolders]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={`p-4 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
        {isOpen && (
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
                            autoFocus
                          />
                        ) : (
                          <>
                            <span className="flex-grow">{folder.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => startEditing(folder.id, folder.name, e)}
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
                                      autoFocus
                                    />
                                  ) : (
                                    <>
                                      <span className="flex-grow text-sm truncate">{chat.name}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-0 h-5 w-5 min-w-5"
                                        onClick={(e) => startEditing(chat.id, chat.name, e)}
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
          </>
        )}
      </div>
    </DragDropContext>
  );
}
