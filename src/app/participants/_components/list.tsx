"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Participant } from "@/generated/prisma";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useParticipantStore } from "../store/participant";

interface ListProps {
  participants: Participant[];
}

interface SwipeableRowProps {
  participant: Participant;
  isSwiped: boolean;
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
  onSelect: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
}

const SwipeableRow: React.FC<SwipeableRowProps> = ({
  participant,
  isSwiped,
  onSwipedLeft,
  onSwipedRight,
  onSelect,
  onDelete,
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipedLeft(),
    onSwipedRight: () => onSwipedRight(),
    delta: 50,
  });

  return (
    <TableRow
      {...handlers}
      onClick={() => onSelect(participant)}
      className="relative group"
    >
      <TableCell className="font-medium">{participant.id}</TableCell>
      <TableCell>{participant.name}</TableCell>
      <TableCell className="w-[80px] text-right">
        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(participant);
          }}
          className={`transition-opacity duration-200 \
            ${isSwiped ? "opacity-100" : "opacity-0"}
          `}
        >
          <Trash />
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};

export const List = ({ participants }: ListProps) => {
  const setSelected = useParticipantStore(
    (state) => state.setSelectedParticipant
  );
  const setAction = useParticipantStore((state) => state.setAction);
  const [swipedId, setSwipedId] = useState<number | null>(null);

  const participantsRow = participants.map((participant) => (
    <SwipeableRow
      key={participant.id}
      participant={participant}
      isSwiped={swipedId === participant.id}
      onSwipedLeft={() => setSwipedId(participant.id)}
      onSwipedRight={() => setSwipedId(null)}
      onSelect={(participant) => {
        setSelected(participant);
        setAction("update");
      }}
      onDelete={(participant) => {
        console.log(participant);
        setSelected(participant);
        setAction("delete");
      }}
    />
  ));

  return (
    <Table>
      <TableCaption>
        Liste de tous les participants aux Olympiades.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Nom</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{participantsRow}</TableBody>
    </Table>
  );
};
