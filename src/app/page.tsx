import { ModeToggle } from "@/components/toggle-mode";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <ModeToggle />
      <Link href="/participants">Liste des participants</Link>
    </div>
  );
}
