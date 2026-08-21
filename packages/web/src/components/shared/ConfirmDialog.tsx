import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogOverlay } from "radix-ui/alert-dialog";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
    open,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "destructive",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {

    return (
        <AlertDialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onCancel();
                }
            }}
        >
            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>


                <AlertDialogFooter>

                    <AlertDialogCancel onClick={onCancel}>
                        {cancelText}
                    </AlertDialogCancel>


                    <AlertDialogAction
                        onClick={onConfirm}
                        className={
                            variant === "destructive"
                            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            : "bg-primary hover:bg-primary/90 text-white"
                        }
                    >
                        {confirmText}
                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>
    );
};

export default ConfirmDialog;