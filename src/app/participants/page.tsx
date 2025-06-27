import { prisma } from "@/lib/prisma";
import { Create } from "./_components/create";
import { Delete } from "./_components/delete";
import { List } from "./_components/list";
import { Update } from "./_components/update";

export const Participants = async () => {
  const participants = await prisma.participant.findMany();

  async function create(data: FormData) {
    "use server";
    const name = data.get("name") as string;
    await prisma.participant.create({ data: { name } });
  }

  async function update(data: FormData) {
    "use server";
    const id = data.get("id") as string;
    const name = data.get("name") as string;
    await prisma.participant.update({
      where: { id: Number(id) },
      data: { name },
    });
  }

  async function deleteParticipant(data: FormData) {
    "use server";
    const id = data.get("id") as string;
    await prisma.participant.delete({ where: { id: Number(id) } });
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold my-4 text-center">Participants</h1>

      <Create action={create} />
      <Update action={update} />
      <Delete action={deleteParticipant} />

      <List participants={participants} />
    </div>
  );
};

export default Participants;
