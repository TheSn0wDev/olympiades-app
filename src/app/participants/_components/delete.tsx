"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useParticipantStore } from "../store/participant";

type Props = {
  action: (formData: FormData) => Promise<void>;
};

export const Delete = ({ action }: Props) => {
  const participant = useParticipantStore((state) => state.selectedParticipant);
  const clearParticipant = useParticipantStore(
    (state) => state.clearSelectedParticipant
  );
  const actionType = useParticipantStore((state) => state.action);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!participant) {
      console.error("Participant are required for update");
      return;
    }

    const form = new FormData();
    form.set("id", participant.id.toString());

    startTransition(async () => {
      await action(form);
      router.refresh();
      clearParticipant();
    });
  }

  return (
    <>
      <Dialog
        open={participant !== null && actionType === "delete"}
        onOpenChange={(e) => {
          if (!e) {
            clearParticipant();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer {participant?.name} ?</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            Cette action est irréversible. Elle supprimera définitivement le
            participant et toutes ses données associées.
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleSubmit}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Suppression
                </>
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
