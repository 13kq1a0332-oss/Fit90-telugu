import { describe, it, expect } from "vitest";
import { en } from "@/lib/i18n/dictionaries/en";
import { te } from "@/lib/i18n/dictionaries/te";
import { getDictionary } from "@/lib/i18n/index";

describe("I18n Localization Engine", () => {
  it("should have complete dictionary parity between English and Telugu", () => {
    const enKeys = Object.keys(en) as (keyof typeof en)[];
    const teKeys = Object.keys(te) as (keyof typeof te)[];

    expect(teKeys.sort()).toEqual(enKeys.sort());

    for (const section of enKeys) {
      const enSection = en[section];
      const teSection = te[section];

      const enSubKeys = Object.keys(enSection);
      const teSubKeys = Object.keys(teSection);

      expect(teSubKeys.sort()).toEqual(enSubKeys.sort());
    }
  });

  it("should retrieve default Telugu dictionary properly", () => {
    const dict = getDictionary("te");
    expect(dict.app.title).toBe("ఫిట్90 తెలుగు");
    expect(dict.auth.loginButton).toBe("లాగిన్ అవ్వండి");
  });

  it("should retrieve English dictionary properly", () => {
    const dict = getDictionary("en");
    expect(dict.app.title).toBe("Fit90 Telugu");
    expect(dict.auth.loginButton).toBe("Sign In");
  });

  it("should fallback gracefully if an unknown locale is passed", () => {
    // @ts-expect-error Testing invalid locale input
    const dict = getDictionary("fr");
    expect(dict).toBeDefined();
    expect(dict.app.title).toBe("ఫిట్90 తెలుగు");
  });
});

