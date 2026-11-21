import { useId } from "react";
import { AlertTriangle, Trash01 } from "@untitledui/icons";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";

interface ConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
    /** Permanent actions get a red icon; reversible ones get a warning icon. */
    isPermanent?: boolean;
}

export const ConfirmDialog = ({ isOpen, onOpenChange, title, description, confirmLabel, onConfirm, isPermanent = false }: ConfirmDialogProps) => {
    const titleId = useId();
    const descriptionId = useId();

    return (
        <ModalOverlay isDismissable isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal className="sm:max-w-md">
                <Dialog role="alertdialog" aria-labelledby={titleId} aria-describedby={descriptionId}>
                    <div className="p-6">
                        <FeaturedIcon icon={isPermanent ? Trash01 : AlertTriangle} color={isPermanent ? "error" : "warning"} theme="light" size="lg" />
                        <h2 id={titleId} className="mt-4 text-lg font-semibold text-primary">
                            {title}
                        </h2>
                        <p id={descriptionId} className="mt-1 text-sm text-tertiary">
                            {description}
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button color="secondary" size="lg" onPress={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                color="primary-destructive"
                                size="lg"
                                onPress={() => {
                                    onOpenChange(false);
                                    onConfirm();
                                }}
                            >
                                {confirmLabel}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
};
