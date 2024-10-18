import { useState } from 'react';
import { ChevronDown, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const models = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'gemini', name: 'Gemini' },
];

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between shadow-lg hover:shadow-xl transition-shadow"
        >
          <Bot className="mr-2 h-4 w-4" />
          {models.find(model => model.id === selectedModel)?.name || 'Select Model'}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => {
              onSelectModel(model.id);
              setIsOpen(false);
            }}
          >
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
