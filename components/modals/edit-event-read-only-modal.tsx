"use client";

import { formatDate } from "@/helpers/formatDateFunc";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

const EditEventReadOnlyModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "editEventReadOnly";

  const { event } = data;

  const handleClose = () => {
    onClose();
  };

  if (!event) {
    return (
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white dark:bg-[#313338] text-black dark:text-zinc-50 p-0 overflow-hidden">
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className="text-2xl text-center">Oops.</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Which Event are we talking about here?
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="bg-white dark:bg-[#313338] text-black dark:text-zinc-50 p-0 overflow-hidden flex items-center justify-center"
        style={{ minHeight: "200px" }}
      >
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center">
            {event.name}
          </DialogTitle>
          <Badge variant="secondary" className="w-auto">
            {`${formatDate(event.startDateTime)} - ${formatDate(
              event.endDateTime
            )}`}
          </Badge>
          <DialogDescription className="text-center dark:text-zinc-200 text-black p-2">
            {event.description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventReadOnlyModal;
