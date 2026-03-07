"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const t = useTranslations("nav");
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border-default bg-bg-base/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl text-text-primary transition-colors group-hover:text-accent-teal">
            SEO
          </span>
          <span className="h-2 w-2 rounded-full bg-accent-teal animate-pulse" />
          <span className="font-display text-2xl text-text-primary transition-colors group-hover:text-accent-teal">
            Tools
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/tools"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {t("tools")}
          </Link>
          {isSignedIn && (
            <Link
              href="/analyses"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {t("analyses")}
            </Link>
          )}
          <Link
            href="/pricing"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {t("pricing")}
          </Link>
          <Link
            href="/docs"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {t("docs")}
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md bg-bg-elevated border border-border-default text-text-muted hover:border-border-strong transition-colors"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
            <span className="text-xs">⌘K</span>
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Auth Buttons */}
          {!isSignedIn ? (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  {t("signIn")}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="primary" size="sm">
                  {t("signUp")}
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  {t("dashboard")}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary hidden md:inline">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </span>
              </div>
            </>
          )}

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
