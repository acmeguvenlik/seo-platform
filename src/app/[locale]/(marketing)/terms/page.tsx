import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Kullanım Koşulları - SEO Tools Platform",
  description: "SEO Tools Platform kullanım koşulları ve hizmet şartları",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-display text-text-primary">
            Kullanım Koşulları
          </h1>
          <p className="text-text-secondary">
            Son güncelleme: 7 Mart 2026
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Hizmet Kullanımı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              SEO Tools Platform'u kullanarak, bu kullanım koşullarını kabul etmiş olursunuz.
              Hizmetlerimizi kullanırken:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Yasal amaçlar için kullanmalısınız</li>
              <li>Başkalarının haklarına saygı göstermelisiniz</li>
              <li>Sistemi kötüye kullanmamalısınız</li>
              <li>Doğru bilgiler sağlamalısınız</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Hesap Sorumluluğu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>Hesabınızın güvenliğinden siz sorumlusunuz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Güçlü bir şifre kullanın</li>
              <li>Hesap bilgilerinizi kimseyle paylaşmayın</li>
              <li>Şüpheli aktiviteleri bildirin</li>
              <li>Hesabınızda yapılan tüm işlemlerden sorumlusunuz</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Ücretlendirme ve Abonelik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>Ücretli planlar için:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Aylık veya yıllık ödeme seçenekleri mevcuttur</li>
              <li>Otomatik yenileme varsayılan olarak aktiftir</li>
              <li>İptal etmediğiniz sürece aboneliğiniz devam eder</li>
              <li>İade politikamız 14 gün içinde geçerlidir</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Fikri Mülkiyet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Platform üzerindeki tüm içerik, tasarım ve kod SEO Tools Platform'a aittir.
              İzinsiz kullanım yasaktır.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Hizmet Kesintileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Bakım, güncelleme veya teknik sorunlar nedeniyle hizmet kesintileri yaşanabilir.
              Bu durumlardan sorumlu değiliz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Sorumluluk Reddi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Hizmetlerimiz "olduğu gibi" sunulmaktadır. Analiz sonuçlarının doğruluğunu
              garanti etmiyoruz. Kararlarınızı kendi sorumluluğunuzda alın.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Değişiklikler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Bu koşulları istediğimiz zaman değiştirme hakkını saklı tutarız.
              Önemli değişiklikler e-posta ile bildirilecektir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. İletişim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Kullanım koşulları hakkında sorularınız için:
            </p>
            <p>
              E-posta: legal@seotools.com<br />
              Adres: [Şirket Adresi]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
