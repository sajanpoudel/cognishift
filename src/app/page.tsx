import AIResponseGenerator from '@/components/AIResponseGenerator';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Response Refiner</h1>
        <ThemeToggle />
      </header>
      <main className="container mx-auto px-4 py-8">
        <AIResponseGenerator />
      </main>
    </div>
  );
}
