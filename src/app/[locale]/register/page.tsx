import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { RegisterForm } from "@/components/RegisterForm";
import { PageLoader } from "@/components/PageLoader";

type Props = { params: Promise<{ locale: string }> };

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="auth-page">
      <div className="auth-page-ambient" aria-hidden />
      <Suspense
        fallback={
          <div className="auth-page-loader">
            <PageLoader />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
