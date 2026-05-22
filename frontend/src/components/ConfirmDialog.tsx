import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  loading = false
}: ConfirmDialogProps) => (
  <Dialog open={open} onClose={loading ? undefined : onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button
        color="error"
        variant="contained"
        disabled={loading}
        onClick={() => void onConfirm()}
        startIcon={loading ? <CircularProgress color="inherit" size={16} /> : undefined}
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);
