import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-text-primary mb-2">
            Hesap Oluşturun
          </h1>
          <p className="text-text-secondary">
            Ücretsiz hesap oluşturun ve SEO araçlarını kullanmaya başlayın
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-bg-elevated border border-border-default shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
