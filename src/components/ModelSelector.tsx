interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <span>Select AI Model:</span>
      <select
        value={selectedModel}
        onChange={(e) => onSelectModel(e.target.value)}
        className="p-2 border rounded-md bg-background"
      >
        <option value="openai">OpenAI</option>
        <option value="gemini">Gemini</option>
      </select>
    </div>
  );
}
