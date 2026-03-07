import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Gizlilik Politikası - SEO Tools Platform",
  description: "SEO Tools Platform gizlilik politikası ve veri koruma uygulamaları",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-display text-text-primary">
            Gizlilik Politikası
          </h1>
          <p className="text-text-secondary">
            Son güncelleme: 7 Mart 2026
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Toplanan Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              SEO Tools Platform olarak, hizmetlerimizi sunabilmek için aşağıdaki bilgileri toplarız:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hesap bilgileri (e-posta, isim)</li>
              <li>Kullanım verileri (analiz edilen URL'ler, araç kullanımı)</li>
              <li>Teknik bilgiler (IP adresi, tarayıcı bilgisi)</li>
              <li>Çerezler ve benzeri teknolojiler</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Bilgilerin Kullanımı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
              <li>Kullanıcı deneyimini kişiselleştirmek</li>
              <li>Güvenlik ve dolandırıcılık önleme</li>
              <li>İletişim ve destek sağlama</li>
              <li>Yasal yükümlülükleri yerine getirme</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Veri Güvenliği</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Verilerinizin güvenliğini ciddiye alıyoruz. Endüstri standardı güvenlik önlemleri kullanıyoruz:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>SSL/TLS şifreleme</li>
              <li>Güvenli veri depolama</li>
              <li>Düzenli güvenlik denetimleri</li>
              <li>Erişim kontrolü ve yetkilendirme</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Çerezler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Web sitemizde çerezler kullanıyoruz. Çerezler, tarayıcınızda saklanan küçük metin dosyalarıdır.
              Çerezleri şu amaçlarla kullanırız:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Oturum yönetimi</li>
              <li>Kullanıcı tercihlerini hatırlama</li>
              <li>Analitik ve performans ölçümü</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Üçüncü Taraf Hizmetler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>Aşağıdaki üçüncü taraf hizmetleri kullanıyoruz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Clerk (Kimlik doğrulama)</li>
              <li>Neon (Veritabanı)</li>
              <li>Upstash (Önbellekleme)</li>
              <li>Anthropic (AI hizmetleri)</li>
              <li>Vercel (Hosting)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Haklarınız</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Verilerinize erişim hakkı</li>
              <li>Verilerin düzeltilmesini isteme hakkı</li>
              <li>Verilerin silinmesini isteme hakkı</li>
              <li>Veri taşınabilirliği hakkı</li>
              <li>İtiraz etme hakkı</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. İletişim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Gizlilik politikamız hakkında sorularınız varsa, bizimle iletişime geçebilirsiniz:
            </p>
            <p>
              E-posta: privacy@seotools.com<br />
              Adres: [Şirket Adresi]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
