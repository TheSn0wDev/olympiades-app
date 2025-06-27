"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useParticipantStore } from "../store/participant";

type Props = {
  action: (formData: FormData) => Promise<void>;
};

export const Update = ({ action }: Props) => {
  const participant = useParticipantStore((state) => state.selectedParticipant);
  const actionType = useParticipantStore((state) => state.action);
  const clearParticipant = useParticipantStore(
    (state) => state.clearSelectedParticipant
  );
  const [name, setName] = useState(participant?.name);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (participant) {
      setName(participant.name);
    }
  }, [participant]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!participant || !name) {
      console.error("Participant and name are required for update");
      return;
    }

    const form = new FormData();
    form.set("id", participant.id.toString());
    form.set("name", name);

    startTransition(async () => {
      await action(form);
      router.refresh();
      clearParticipant();
      setName("");
    });
  }

  return (
    <>
      <Dialog
        open={participant !== null && actionType === "update"}
        onOpenChange={(e) => {
          if (!e) {
            clearParticipant();
            setName("");
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Mettre à jour un participant</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Clément le boss"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPending}
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending || !name?.trim()}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
