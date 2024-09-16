import { dashboardMap } from "./dashboard";
import { reportMap } from "./report";
import { navigationMap } from "./navigation";
import { authMap } from "./auth";
import { homepageMap } from "./homepage";
import { termsMap } from "./terms";
import { componentsMap } from "./components";
import { marketMap } from "./market";

const translationMap = {
  dashboard: dashboardMap,
  report: reportMap,
  navigation: navigationMap,
  homepage: homepageMap,
  auth: authMap,
  terms: termsMap,
  components: componentsMap,
  market: marketMap,
};

export type SectionType = keyof typeof translationMap;

export class Translator {
  constructor(private section: SectionType) {
    this.section = section;
  }

  private map = translationMap;

  getTranslation = (language: string, position: string): string => {
    return this.map[this.section][language][position];
  };
}
