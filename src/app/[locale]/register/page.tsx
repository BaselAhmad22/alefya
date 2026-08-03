import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/RegisterForm";
import { PageLoader } from "@/components/PageLoader";

type Props = { params: Promise<{ locale: string }> };

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto flex max-w-6xl px-4 py-16 sm:px-6">
      <Suspense
        fallback={
          <div className="mx-auto flex w-full max-w-md justify-center py-16">
            <PageLoader />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
