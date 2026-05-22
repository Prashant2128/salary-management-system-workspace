import { Alert } from "@mui/material";

interface ErrorAlertProps {
  message: string | null;
  onClose?: () => void;
}

export const ErrorAlert = ({ message, onClose }: ErrorAlertProps) => {
  if (!message) {
    return null;
  }

  return (
    <Alert severity="error" onClose={onClose}>
      {message}
    </Alert>
  );
};
