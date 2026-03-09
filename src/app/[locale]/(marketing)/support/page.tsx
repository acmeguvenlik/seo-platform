import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageCircle, Book, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Destek - SEO Tools Platform",
  description: "SEO Tools Platform destek ve yardım merkezi",
};

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-display text-text-primary">
            Destek Merkezi
          </h1>
          <p className="text-text-secondary text-lg">
            Size nasıl yardımcı olabiliriz?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-teal/10 rounded-lg">
                  <Book className="w-6 h-6 text-accent-teal" />
                </div>
                <CardTitle>Dokümantasyon</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-secondary">
              <p>
                Tüm araçlarımız için detaylı kullanım kılavuzları ve örnekler.
              </p>
              <a 
                href="/docs" 
                className="inline-block px-4 py-2 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90 transition-colors"
              >
                Dokümantasyona Git
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-teal/10 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-accent-teal" />
                </div>
                <CardTitle>SSS</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-secondary">
              <p>
                Sık sorulan sorular ve cevapları.
              </p>
              <a 
                href="#faq" 
                className="inline-block px-4 py-2 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90 transition-colors"
              >
                SSS'ye Git
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-teal/10 rounded-lg">
                  <Mail className="w-6 h-6 text-accent-teal" />
                </div>
                <CardTitle>E-posta Desteği</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-secondary">
              <p>
                Teknik destek için bize e-posta gönderin.
              </p>
              <a 
                href="mailto:support@seotools.com" 
                className="inline-block px-4 py-2 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90 transition-colors"
              >
                E-posta Gönder
              </a>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent-teal/10 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-accent-teal" />
                </div>
                <CardTitle>Canlı Destek</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-text-secondary">
              <p>
                Hızlı yanıt için canlı destek hattımızı kullanın.
              </p>
              <button 
                className="px-4 py-2 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90 transition-colors"
                onClick={() => alert('Canlı destek yakında aktif olacak!')}
              >
                Sohbet Başlat
              </button>
            </CardContent>
          </Card>
        </div>

        <Card id="faq">
          <CardHeader>
            <CardTitle>Sık Sorulan Sorular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-text-secondary">
            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                SEO araçlarını nasıl kullanabilirim?
              </h3>
              <p>
                Tüm araçlarımız kullanıcı dostu arayüzlere sahiptir. Sadece analiz etmek 
                istediğiniz URL'yi girin ve "Analiz Et" butonuna tıklayın. Detaylı sonuçlar 
                birkaç saniye içinde hazır olacaktır.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                Ücretsiz plan ile ne kadar analiz yapabilirim?
              </h3>
              <p>
                Ücretsiz plan ile saatte 10 analiz yapabilirsiniz. Daha fazla analiz için 
                Pro planımıza yükseltebilirsiniz (saatte 100 analiz).
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                AI araçları nasıl çalışır?
              </h3>
              <p>
                AI araçlarımız Google Gemini 2.0 Flash modelini kullanır. Bu araçlar, 
                içeriğinizi analiz eder ve SEO için optimize edilmiş öneriler sunar. 
                Meta açıklamalar, başlıklar, anahtar kelimeler ve daha fazlası için 
                AI destekli içerik üretebilirsiniz.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                Verilerim güvende mi?
              </h3>
              <p>
                Evet, tüm verileriniz SSL/TLS şifreleme ile korunur. Analiz edilen URL'ler 
                ve sonuçlar güvenli bir şekilde saklanır. Detaylı bilgi için 
                <a href="/privacy" className="text-accent-teal hover:underline"> Gizlilik Politikamızı</a> inceleyebilirsiniz.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                Hangi ödeme yöntemlerini kabul ediyorsunuz?
              </h3>
              <p>
                Kredi kartı (Visa, Mastercard, American Express) ve banka kartı ile ödeme 
                alabiliyoruz. Tüm ödemeler Stripe üzerinden güvenli bir şekilde işlenir.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                Aboneliğimi iptal edebilir miyim?
              </h3>
              <p>
                Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası 
                mevcut dönem sonuna kadar hizmetlerimizi kullanmaya devam edebilirsiniz. 
                Otomatik yenileme yapılmaz.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                API erişimi var mı?
              </h3>
              <p>
                Evet, Kurumsal planımızda API erişimi mevcuttur. API dokümantasyonu için 
                <a href="/api-docs" className="text-accent-teal hover:underline"> API Dokümantasyonu</a> sayfasını ziyaret edebilirsiniz.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                Toplu analiz yapabilir miyim?
              </h3>
              <p>
                Pro ve Kurumsal planlarda toplu analiz özelliği mevcuttur. CSV dosyası 
                yükleyerek birden fazla URL'yi aynı anda analiz edebilirsiniz.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                Raporları dışa aktarabilir miyim?
              </h3>
              <p>
                Evet, tüm analiz sonuçlarını PDF veya CSV formatında dışa aktarabilirsiniz. 
                Bu özellik Pro ve Kurumsal planlarda mevcuttur.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary text-lg">
                Mobil uygulama var mı?
              </h3>
              <p>
                Şu anda mobil uygulamamız bulunmuyor, ancak web sitemiz tüm cihazlarda 
                (mobil, tablet, masaüstü) mükemmel çalışacak şekilde optimize edilmiştir.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hala Yardıma İhtiyacınız Var mı?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <p>
              Sorunuz cevaplandırılmadıysa, lütfen bizimle iletişime geçin:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:support@seotools.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-teal text-white rounded-lg hover:bg-accent-teal/90 transition-colors"
              >
                <Mail className="w-5 h-5" />
                E-posta Gönder
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-accent-teal text-accent-teal rounded-lg hover:bg-accent-teal/10 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                İletişim Formu
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Destek Saatleri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-text-secondary">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">E-posta Desteği</h4>
                <p>7/24 - Yanıt süresi: 24 saat içinde</p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">Canlı Destek</h4>
                <p>Pazartesi - Cuma: 09:00 - 18:00 (GMT+3)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
