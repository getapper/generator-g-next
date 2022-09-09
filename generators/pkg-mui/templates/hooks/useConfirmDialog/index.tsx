import React, { ReactNode, useCallback, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

type useConfirmDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
  content: ReactNode;
  cancelText?: string;
  confirmText?: string;
};

const useConfirmDialog = ({
  onConfirm,
  onCancel,
  content,
  cancelText,
  confirmText,
}: useConfirmDialogProps) => {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => {
    setOpen(true);
  }, []);

  const onConfirmInternal = useCallback(() => {
    setOpen(false);
    onConfirm();
  }, [onConfirm]);

  const onCancelInternal = useCallback(() => {
    setOpen(false);
    onCancel();
  }, [onCancel]);

  return {
    open,
    show,
    dialog: (
      <Dialog open={open}>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button color="primary" variant="outlined" onClick={onCancelInternal}>
            {cancelText ?? "Cancel"}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={onConfirmInternal}
          >
            {confirmText ?? "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    ),
  };
};

export default useConfirmDialog;
