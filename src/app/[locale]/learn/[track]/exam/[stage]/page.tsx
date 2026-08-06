import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; track: string; stage: string }>;
};

export default async function LegacyExamPage({ params }: Props) {
  const { locale, track, stage } = await params;
  redirect(`/${locale}/exam/${track}/${stage}`);
}
