import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            Kayıt Ol
          </h1>
          <p className="text-text-secondary">
            Ücretsiz hesap oluşturun ve SEO araçlarını kullanmaya başlayın
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-text-secondary">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/sign-in"
            className="text-accent-teal hover:underline font-medium"
          >
            Giriş Yap
          </Link>
        </div>
      </Card>
    </div>
  );
}
