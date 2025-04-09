import "./globals.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { frFR, enUS } from "@clerk/localizations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knowsay",
  description: "A quizz platform for everyone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings:
            process.env.NODE_ENV === "production",
        },
      }}
      localization={locale === "en" ? enUS : frFR}
    >
      <html lang={locale}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <NextIntlClientProvider messages={messages}>
            <NextTopLoader
              showSpinner={false}
              shadow={false}
              color="var(--primary)"
            />
            <main>{children}</main>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
