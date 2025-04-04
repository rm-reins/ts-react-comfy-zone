import { Link } from "react-router-dom";
import { Button, ErrorImage } from "@/shared";

interface ErrorFallbackProps {
  error?: Error | unknown;
}

export function ErrorFallback({ error }: ErrorFallbackProps) {
  // Extract error message based on error type
  let errorMessage = "An unexpected error occurred.";

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === "object" && "statusText" in error) {
    // Handle React Router errors
    const routerError = error as { statusText?: string; status?: number };
    errorMessage =
      routerError.statusText || `Error ${routerError.status || "unknown"}`;
  }

  return (
    <div className="flex px-8 flex-col items-center space-y-4 justify-center h-screen">
      <ErrorImage />
      <h1 className="md:text-4xl text-2xl font-bold">There was an error.</h1>
      <p className="text-muted-foreground max-w-md text-center md:text-3xl text-xl font-medium">
        {errorMessage}
      </p>
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
