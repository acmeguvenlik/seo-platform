"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, Zap, Save, RefreshCw } from "lucide-react";
import { theme, cn } from "@/lib/theme-classes";

const GEMINI_MODELS = [
  { value: 'gemini-flash-latest', label: 'Gemini Flash Latest', version: 'Latest', speed: 'Ultra Fast', cost: 'Low', recommended: true },
  { value: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite Preview', version: '3.1', speed: 'Ultra Fast', cost: 'Ultra Low' },
  { value: 'gemini-3-flash-preview', label: 'Gemini 3.0 Flash Preview', version: '3.0', speed: 'Ultra Fast', cost: 'Low' },
  { value: 'gemini-flash-lite-latest', label: 'Gemini Flash Lite Latest', version: 'Latest', speed: 'Ultra Fast', cost: 'Ultra Low' },
  { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash Experimental', version: '2.0', speed: 'Fast', cost: 'Low' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', version: '2.0', speed: 'Fast', cost: 'Low' },
  { value: 'gemini-2.0-flash-thinking-exp', label: 'Gemini 2.0 Flash Thinking', version: '2.0', speed: 'Medium', cost: 'Low' },
  { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash Latest', version: '1.5', speed: 'Fast', cost: 'Low' },
  { value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash-8B', version: '1.5', speed: 'Fastest', cost: 'Lowest' },
  { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro Latest', version: '1.5', speed: 'Medium', cost: 'Medium' },
];

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-flash-latest");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    // Load current settings
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings/ai");
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.apiKey || "");
        setSelectedModel(data.model || "gemini-flash-latest");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
        }),
      });

      if (response.ok) {
        alert("Ayarlar kaydedildi!");
      } else {
        alert("Ayarlar kaydedilemedi!");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Bir hata oluştu!");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch("/api/settings/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
        }),
      });

      const data = await response.json();
      setTestResult({
        success: response.ok,
        message: data.message || (response.ok ? "API bağlantısı başarılı!" : "API bağlantısı başarısız!"),
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: "Bağlantı hatası!",
      });
    } finally {
      setTesting(false);
    }
  };

  const selectedModelInfo = GEMINI_MODELS.find(m => m.value === selectedModel);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-accent-teal" />
          <div>
            <h1 className="text-3xl font-display text-text-primary">
              AI Ayarları
            </h1>
            <p className="text-text-secondary">
              Google Gemini AI yapılandırması
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-accent-teal" />
              <CardTitle>API Anahtarı</CardTitle>
            </div>
            <CardDescription>
              Google AI Studio'dan API anahtarınızı girin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="apiKey">Gemini API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="mt-2 font-mono"
              />
              <p className={cn(theme.text.small, theme.text.muted, "mt-1")}>
                API anahtarınızı{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-teal hover:underline"
                >
                  Google AI Studio
                </a>
                'dan alabilirsiniz
              </p>
            </div>

            <Button
              onClick={handleTest}
              disabled={!apiKey || testing}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Test Ediliyor...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  API Bağlantısını Test Et
                </>
              )}
            </Button>

            {testResult && (
              <div
                className={cn(
                  "p-4 rounded-lg",
                  testResult.success
                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                )}
              >
                {testResult.message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-teal" />
              <CardTitle>AI Model Seçimi</CardTitle>
            </div>
            <CardDescription>
              Kullanılacak Gemini modelini seçin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="model">Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GEMINI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex items-center gap-2">
                        {model.label}
                        {model.recommended && (
                          <Badge variant="default" className="ml-2">
                            Önerilen
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedModelInfo && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-bg-secondary rounded-lg">
                <div>
                  <p className={cn(theme.text.small, theme.text.muted)}>Versiyon</p>
                  <p className="font-semibold text-text-primary">{selectedModelInfo.version}</p>
                </div>
                <div>
                  <p className={cn(theme.text.small, theme.text.muted)}>Hız</p>
                  <p className="font-semibold text-text-primary">{selectedModelInfo.speed}</p>
                </div>
                <div>
                  <p className={cn(theme.text.small, theme.text.muted)}>Maliyet</p>
                  <p className="font-semibold text-text-primary">{selectedModelInfo.cost}</p>
                </div>
                <div>
                  <p className={cn(theme.text.small, theme.text.muted)}>Durum</p>
                  <Badge variant="default">Aktif</Badge>
                </div>
              </div>
            )}

            <div className={cn("p-4 rounded-lg", theme.bg.secondary)}>
              <h4 className="font-semibold text-text-primary mb-2">Model Önerileri:</h4>
              <ul className={cn("space-y-2", theme.text.small, theme.text.secondary)}>
                <li>• <strong>gemini-flash-latest:</strong> Her zaman en yeni modeli kullanır (Önerilen)</li>
                <li>• <strong>gemini-3.1-flash-lite-preview:</strong> En hızlı ve en ucuz</li>
                <li>• <strong>gemini-3-flash-preview:</strong> En yeni özellikler</li>
                <li>• <strong>gemini-flash-lite-latest:</strong> Düşük maliyet, yüksek hız</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            onClick={handleSave}
            disabled={!apiKey || saving}
            className="bg-accent-teal hover:bg-accent-teal/90"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Ayarları Kaydet
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
