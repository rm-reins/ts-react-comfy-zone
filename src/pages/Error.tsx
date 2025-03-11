import { useRouteError, Link, isRouteErrorResponse } from "react-router-dom";
import { Button, ErrorImage } from "@/components";

function Error() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="flex px-8 flex-col items-center space-y-4 justify-center h-screen">
        <ErrorImage />
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you are looking for does not exist.
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
  return (
    <div className="flex px-8 flex-col items-center space-y-4 justify-center h-screen">
      <ErrorImage />
      <h1 className="text-4xl font-bold">There was an error.</h1>
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
export default Error;
