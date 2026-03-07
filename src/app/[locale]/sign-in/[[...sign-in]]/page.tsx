import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Giriş Yap
          </h1>
          <p className="text-text-secondary">
            SEO Tools Platform hesabınıza giriş yapın
          </p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-text-secondary">
          Hesabınız yok mu?{" "}
          <Link
            href="/sign-up"
            className="text-accent-teal hover:underline font-medium"
          >
            Kayıt Ol
          </Link>
        </div>
      </Card>
    </div>
  );
}
