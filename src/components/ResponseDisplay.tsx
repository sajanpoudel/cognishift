interface ResponseDisplayProps {
  response: {
    original: string;
    humanized: string;
    aiScore: number | null;
  };
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">Original Response:</h3>
        <p className="p-2 bg-secondary rounded-md">{response.original}</p>
      </div>
      <div>
        <h3 className="font-semibold">Humanized Response:</h3>
        <p className="p-2 bg-secondary rounded-md">{response.humanized}</p>
      </div>
      {response.aiScore !== null && (
        <div>
          <h3 className="font-semibold">AI Detection Score:</h3>
          <p className="p-2 bg-secondary rounded-md">{(response.aiScore * 100).toFixed(2)}% AI-generated</p>
        </div>
      )}
    </div>
  );
}
