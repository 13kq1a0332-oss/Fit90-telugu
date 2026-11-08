import { en, Dictionary } from "./dictionaries/en";
import { te } from "./dictionaries/te";
import { Locale } from "@/types/database.types";

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  te,
};

export const getDictionary = (locale: Locale = "te"): Dictionary => {
  return dictionaries[locale] || dictionaries.te;
};

export type { Dictionary };
export type { Locale };

