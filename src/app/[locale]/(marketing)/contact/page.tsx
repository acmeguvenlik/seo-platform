import { ContactForm } from "@/components/contact/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, Clock } from "lucide-react";

export const metadata = {
  title: "İletişim - SEO Tools Platform",
  description: "Bizimle iletişime geçin, sorularınızı sorun",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display text-text-primary mb-4">
            İletişime Geçin
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Sorularınız mı var? Yardıma mı ihtiyacınız var? Bize ulaşın, size yardımcı olmaktan mutluluk duyarız.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent-teal-dim flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-accent-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">E-posta</h3>
                    <p className="text-sm text-text-secondary">support@seotools.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent-amber/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-accent-amber" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Canlı Destek</h3>
                    <p className="text-sm text-text-secondary">7/24 online destek</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Yanıt Süresi</h3>
                    <p className="text-sm text-text-secondary">Ortalama 2 saat</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-text-primary mb-3">Sık Sorulan Sorular</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Çoğu sorunun cevabını SSS bölümümüzde bulabilirsiniz.
                </p>
                <a
                  href="/pricing#faq"
                  className="text-sm text-accent-teal hover:underline"
                >
                  SSS'yi Görüntüle →
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
