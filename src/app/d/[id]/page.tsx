import { getAltLink } from "@/app/actions/datasets";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const link = await getAltLink(id);

  if (!link) {
    return redirect("/datasets");
  }

  return redirect(link.link);
}
