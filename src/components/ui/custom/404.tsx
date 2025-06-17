// components/NotFound.tsx
import { Link, useRouter } from '@tanstack/react-router';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.history.go(-1); // Goes back to the previous page in history
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="text-center  space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Oops!</h1>
        <p className="text-xl">This page doesn't exist.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Home
          </Link>
          
          <Link
            to="/invoice"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Invoice Generator
          </Link>
          
          <Link
            to="/receipt"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Receipt Builder
          </Link>
          
          <Link
            to="/quote"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            Create a Quote
          </Link>
        </div>

        <button
          onClick={handleGoBack}
          className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-foreground/20 hover:bg-foreground/10 transition-colors"
        >
          Go Back to Previous Page
        </button>
      </div>
    </div>
  );
}