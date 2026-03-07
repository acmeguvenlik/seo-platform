"use client";

import { useState } from "react";
import { useUser } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Shield, CreditCard, Globe } from "lucide-react";

export function SettingsContent() {
  const { user } = useUser();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display text-text-primary">Ayarlar</h1>
          <p className="text-text-secondary mt-1">
            Hesap ayarlarınızı ve tercihlerinizi yönetin
          </p>
        </div>

        {saved && (
          <Alert variant="success">
            <AlertDescription>Ayarlarınız başarıyla kaydedildi!</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Bildirimler
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Güvenlik
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2" />
              Faturalama
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>
                  Hesap bilgilerinizi güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Ad Soyad"
                  defaultValue={user?.name || ""}
                  placeholder="Adınız Soyadınız"
                />
                <Input
                  label="E-posta"
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  helperText="E-posta adresinizi değiştirmek için destek ekibiyle iletişime geçin"
                />
                <Select
                  label="Dil"
                  options={[
                    { value: "tr", label: "Türkçe" },
                    { value: "en", label: "English" },
                    { value: "de", label: "Deutsch" },
                    { value: "es", label: "Español" },
                    { value: "fr", label: "Français" },
                  ]}
                  defaultValue="tr"
                />
                <Button onClick={handleSave}>Kaydet</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bildirim Tercihleri</CardTitle>
                <CardDescription>
                  Hangi bildirimleri almak istediğinizi seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">E-posta Bildirimleri</p>
                      <p className="text-sm text-text-muted">Önemli güncellemeler için e-posta alın</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">Analiz Tamamlandı</p>
                      <p className="text-sm text-text-muted">Analiz tamamlandığında bildirim alın</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">Haftalık Rapor</p>
                      <p className="text-sm text-text-muted">Haftalık kullanım raporu alın</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">Pazarlama E-postaları</p>
                      <p className="text-sm text-text-muted">Yeni özellikler ve kampanyalar hakkında bilgi alın</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </div>
                <Button onClick={handleSave}>Kaydet</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Güvenlik Ayarları</CardTitle>
                <CardDescription>
                  Hesabınızın güvenliğini yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Şifre</h4>
                    <p className="text-sm text-text-muted mb-3">
                      Son değiştirilme: 30 gün önce
                    </p>
                    <Button variant="outline">Şifreyi Değiştir</Button>
                  </div>
                  <div className="border-t border-border-default pt-4">
                    <h4 className="font-medium text-text-primary mb-2">İki Faktörlü Doğrulama</h4>
                    <p className="text-sm text-text-muted mb-3">
                      Hesabınıza ekstra güvenlik katmanı ekleyin
                    </p>
                    <Badge variant="default">Aktif Değil</Badge>
                    <Button variant="outline" className="ml-3">Aktif Et</Button>
                  </div>
                  <div className="border-t border-border-default pt-4">
                    <h4 className="font-medium text-text-primary mb-2">Aktif Oturumlar</h4>
                    <p className="text-sm text-text-muted mb-3">
                      Hesabınıza bağlı cihazları yönetin
                    </p>
                    <Button variant="outline">Oturumları Görüntüle</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Faturalama ve Abonelik</CardTitle>
                <CardDescription>
                  Plan ve ödeme bilgilerinizi yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-text-primary mb-2">Mevcut Plan</h4>
                    <div className="flex items-center gap-3">
                      <Badge variant="default">FREE</Badge>
                      <span className="text-sm text-text-secondary">
                        Saatte 10 analiz
                      </span>
                    </div>
                    <Button variant="primary" className="mt-3">
                      Pro'ya Yükselt
                    </Button>
                  </div>
                  <div className="border-t border-border-default pt-4">
                    <h4 className="font-medium text-text-primary mb-2">Ödeme Yöntemi</h4>
                    <p className="text-sm text-text-muted mb-3">
                      Kayıtlı ödeme yöntemi bulunmuyor
                    </p>
                    <Button variant="outline">Ödeme Yöntemi Ekle</Button>
                  </div>
                  <div className="border-t border-border-default pt-4">
                    <h4 className="font-medium text-text-primary mb-2">Fatura Geçmişi</h4>
                    <p className="text-sm text-text-muted mb-3">
                      Geçmiş faturalarınızı görüntüleyin ve indirin
                    </p>
                    <Button variant="outline">Faturaları Görüntüle</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
