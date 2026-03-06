import type { MouseEvent } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  loading?: boolean;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  loading = false,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (loading) return;
    void onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 text-white"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
