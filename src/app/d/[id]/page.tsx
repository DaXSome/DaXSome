import { HOST_URL } from "@/utils";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`${HOST_URL}/api/d/${id}`);

  const { link } = await res.json();

  if (res.status === 404) {
    return redirect("/datasets");
  }

  return redirect(link);
}
