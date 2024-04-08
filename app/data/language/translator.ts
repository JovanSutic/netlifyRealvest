import { dashboardMap } from "./dashboard";
import { navigationMap } from "./navigation";

const translationMap = {
  dashboard: dashboardMap,
  navigation: navigationMap,
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
