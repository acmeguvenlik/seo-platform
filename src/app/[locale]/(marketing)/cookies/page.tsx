import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Çerez Politikası - SEO Tools Platform",
  description: "SEO Tools Platform çerez kullanımı ve yönetimi",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-display text-text-primary">
            Çerez Politikası
          </h1>
          <p className="text-text-secondary">
            Son güncelleme: 9 Mart 2026
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Çerezler Nedir?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet veya mobil cihaz) 
              kaydedilen küçük metin dosyalarıdır. Çerezler, web sitelerinin daha verimli çalışmasını 
              sağlar ve site sahiplerine bilgi sağlar.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Çerez Türleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <h3 className="font-semibold text-text-primary">1. Zorunlu Çerezler</h3>
            <p>
              Web sitesinin temel işlevlerini yerine getirmesi için gereklidir. 
              Bu çerezler olmadan site düzgün çalışmaz.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Oturum yönetimi</li>
              <li>Güvenlik ve kimlik doğrulama</li>
              <li>Tercih ayarları</li>
            </ul>

            <h3 className="font-semibold text-text-primary mt-6">2. Performans Çerezleri</h3>
            <p>
              Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sayfa görüntüleme sayısı</li>
              <li>Hata mesajları</li>
              <li>Yükleme süreleri</li>
            </ul>

            <h3 className="font-semibold text-text-primary mt-6">3. İşlevsellik Çerezleri</h3>
            <p>
              Tercihlerinizi hatırlayarak daha kişiselleştirilmiş bir deneyim sunar.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Dil tercihi</li>
              <li>Tema seçimi (açık/koyu mod)</li>
              <li>Bölge ayarları</li>
            </ul>

            <h3 className="font-semibold text-text-primary mt-6">4. Analitik Çerezler</h3>
            <p>
              Site trafiğini ve kullanıcı davranışlarını analiz etmek için kullanılır.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Ziyaretçi istatistikleri</li>
              <li>Trafik kaynakları</li>
              <li>Kullanıcı etkileşimleri</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kullandığımız Çerezler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Çerez Adı</th>
                    <th className="text-left p-2">Tür</th>
                    <th className="text-left p-2">Süre</th>
                    <th className="text-left p-2">Amaç</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">__clerk_db_jwt</td>
                    <td className="p-2">Zorunlu</td>
                    <td className="p-2">Oturum</td>
                    <td className="p-2">Kimlik doğrulama</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">theme</td>
                    <td className="p-2">İşlevsellik</td>
                    <td className="p-2">1 yıl</td>
                    <td className="p-2">Tema tercihi</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">locale</td>
                    <td className="p-2">İşlevsellik</td>
                    <td className="p-2">1 yıl</td>
                    <td className="p-2">Dil tercihi</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">_ga</td>
                    <td className="p-2">Analitik</td>
                    <td className="p-2">2 yıl</td>
                    <td className="p-2">Google Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Çerezleri Yönetme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Çerezleri tarayıcı ayarlarınızdan kontrol edebilir ve silebilirsiniz:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
              <li><strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
              <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
              <li><strong>Edge:</strong> Ayarlar → Gizlilik → Çerezler</li>
            </ul>
            <p className="mt-4">
              <strong>Not:</strong> Zorunlu çerezleri devre dışı bırakırsanız, 
              web sitesinin bazı özellikleri düzgün çalışmayabilir.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Üçüncü Taraf Çerezleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Bazı durumlarda, güvenilir üçüncü tarafların çerezlerini de kullanırız:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Clerk:</strong> Kimlik doğrulama ve kullanıcı yönetimi</li>
              <li><strong>Google Analytics:</strong> Site trafiği analizi (opsiyonel)</li>
              <li><strong>Vercel:</strong> Hosting ve performans optimizasyonu</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onay ve Tercihler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Sitemizi ilk ziyaretinizde, zorunlu olmayan çerezler için onayınızı isteriz. 
              Tercihlerinizi istediğiniz zaman değiştirebilirsiniz.
            </p>
            <p>
              Çerez tercihlerinizi yönetmek için sayfanın altındaki "Çerez Ayarları" 
              bağlantısını kullanabilirsiniz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Politika Güncellemeleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Bu çerez politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler 
              olduğunda sizi bilgilendireceğiz. Güncel politikayı düzenli olarak 
              kontrol etmenizi öneririz.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>İletişim</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Çerez politikamız hakkında sorularınız varsa, bizimle iletişime geçebilirsiniz:
            </p>
            <p>
              E-posta: privacy@seotools.com<br />
              Web: /support
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
