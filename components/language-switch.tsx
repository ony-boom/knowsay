"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function LanguageSwitch() {
  const [locale, setLocale] = useState("en");

  const router = useRouter();

  const changeLocale = useCallback(
    (value: string) => {
      setLocale(value);
      document.cookie = `next-locale=${value}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    },
    [router],
  );

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("next-locale="))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
      return;
    }

    const browserLocale = navigator.language.slice(0, 2);
    const validLocale = ["en", "fr"].includes(browserLocale)
      ? browserLocale
      : "en";

    changeLocale(validLocale);
  }, [changeLocale]);

  const handleChange = (value: string) => {
    changeLocale(value);
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-max border-none shadow-none">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="fr">FR</SelectItem>
      </SelectContent>
    </Select>
  );
}
