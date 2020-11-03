import I18nJs from "i18n-js";

I18nJs.locale = "it"; // a locale from your available translations
export const getLanguages = (): Promise<Array<string>> =>
  Promise.resolve(["it"]);
export default I18nJs;
