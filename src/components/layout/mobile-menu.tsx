"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("nav");
  const { isSignedIn } = useAuth();

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="md:hidden p-2"
        aria-label="Menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-text-secondary" />
        ) : (
          <Menu className="h-5 w-5 text-text-secondary" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-bg-elevated border-b border-border-default z-50 md:hidden">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link
                href="/tools"
                className="px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("tools")}
              </Link>
              {isSignedIn && (
                <>
                  <Link
                    href="/analyses"
                    className="px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("analyses")}
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("dashboard")}
                  </Link>
                </>
              )}
              <Link
                href="/pricing"
                className="px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("pricing")}
              </Link>
              <Link
                href="/docs"
                className="px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("docs")}
              </Link>

              {!isSignedIn && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border-default">
                  <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      {t("signIn")}
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      {t("signUp")}
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
