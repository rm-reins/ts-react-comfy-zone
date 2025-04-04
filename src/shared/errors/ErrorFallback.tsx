import { Link } from "react-router-dom";
import { Button, ErrorImage } from "@/shared";

interface ErrorProps {
  error?: Error;
}

export function ErrorFallback({ error }: ErrorProps) {
  return (
    <div className="flex px-8 flex-col items-center space-y-4 justify-center h-screen">
      <ErrorImage />
      <h1 className="text-4xl font-bold">There was an error.</h1>
      {error && (
        <p className="text-muted-foreground max-w-md text-center">
          {error.message || "An unexpected error occurred."}
        </p>
      )}
      <Button
        asChild
        variant="outline"
        className="border-none bg-primary text-white dark:bg-white dark:text-primary"
      >
        <Link to="/">Go to home</Link>
      </Button>
    </div>
  );
}
export default ErrorFallback;
