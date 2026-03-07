"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
  const t = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-default bg-bg-base">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  {t("tools")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  {t("pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  {t("docs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-text-secondary hover:text-accent-teal transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-default flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-text-primary">
              SEO
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent-teal" />
            <span className="font-display text-lg text-text-primary">
              Tools
            </span>
          </div>
          <p className="text-sm text-text-muted">
            © {currentYear} SEO Tools Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
