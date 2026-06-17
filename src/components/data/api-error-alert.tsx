import { Alert, AlertDescription } from "@/components/ui/alert";
import { getApiErrorMessage } from "@/lib/api/errors";

interface ApiErrorAlertProps {
  error: unknown;
  title?: string;
  className?: string;
}

export function ApiErrorAlert({
  error,
  title = "Request failed",
  className,
}: ApiErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertDescription>
        <span className="font-medium">{title}.</span>{" "}
        {getApiErrorMessage(error)}
      </AlertDescription>
    </Alert>
  );
}
