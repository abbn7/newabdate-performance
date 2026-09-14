import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

function detectLanguage() {
  if (typeof window === "undefined") return "en";
  try {
    return localStorage.getItem("an_lang") || (navigator.language.startsWith("ar") ? "ar" : "en");
  } catch {
    return navigator.language.startsWith("ar") ? "ar" : "en";
  }
}

if (!i18n.isInitialized) {
  const detectedLanguage = detectLanguage();
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
      },
      fallbackLng: "en",
      supportedLngs: ["en", "ar"],
      lng: detectedLanguage,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
}

export function applyDirection(lng: string) {
  if (typeof document === "undefined") return;
  const dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);
}

i18n.on("languageChanged", applyDirection);

export default i18n;
