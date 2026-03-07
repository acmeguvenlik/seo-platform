"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          name="name"
          label="Adınız"
          placeholder="Adınız Soyadınız"
          required
        />
        <Input
          name="email"
          type="email"
          label="E-posta"
          placeholder="ornek@email.com"
          required
        />
      </div>

      <Input
        name="subject"
        label="Konu"
        placeholder="Mesajınızın konusu"
        required
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">
          Mesajınız
        </label>
        <textarea
          name="message"
          rows={6}
          className="flex w-full rounded-md border border-border-default bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus resize-none"
          placeholder="Mesajınızı buraya yazın..."
          required
        />
      </div>

      {success && (
        <Alert variant="success">
          <AlertDescription>
            Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        disabled={loading}
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        Mesaj Gönder
      </Button>
    </form>
  );
}
