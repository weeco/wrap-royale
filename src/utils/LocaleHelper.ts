import * as fs from 'fs';
import * as path from 'path';
import * as slug from 'slug';

/**
 * All available locales for texts.
 */
export enum Locales {
  En = 'en',
  Fr = 'fr',
  De = 'de',
  Es = 'es',
  It = 'it',
  Nl = 'nl',
  No = 'no',
  Tr = 'tr',
  Jp = 'jp',
  Kr = 'kr',
  Ru = 'ru',
  Ar = 'ar',
  Pt = 'pt',
  Cn = 'cn',
  Cnt = 'cnt',
  Fa = 'fa',
  Id = 'id',
  Ms = 'ms',
  Th = 'th',
  Fi = 'fi'
}

export interface IText {
  identifier: string;
  en: string;
  fr: string;
  de: string;
  es: string;
  it: string;
  nl: string;
  no: string;
  tr: string;
  jp: string;
  kr: string;
  ru: string;
  ar: string;
  pt: string;
  cn: string;
  cnt: string;
  fa: string;
  id: string;
  ms: string;
  th: string;
  fi: string;
  [key: string]: string;
}

/**
 * Helper class for retrieving card details by name or decklink id
 */
export namespace LocaleHelper {
  const textById: Map<string, IText> = new Map();
  const textsJsonPath: string = path.join(__dirname, '..', '..', 'assets', 'texts.json');
  const texts: IText[] = <IText[]>JSON.parse(fs.readFileSync(textsJsonPath, 'utf8'));
  const slugOptions: {} = {
    replacement: '-', // replace spaces with replacement
    symbols: true, // replace unicode symbols or not
    remove: /[.]/g, // (optional) regex to remove characters
    lower: true, // result in lower case
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap // replace multi-characters
  };

  // Load all translation into Map
  for (const text of texts) {
    textById.set(text.identifier, text);
  }

  /**
   * Resolves a TID to a translated string.
   * @param textId The TID whose translation should be returned
   * @param locale The desired locale of the to be returned translation (English by default)
   */
  export function getTranslationById(textId: string, locale: Locales = Locales.En): string {
    return textById.get(textId)[locale];
  }

  /**
   * Returns an object with all translations for a given text id
   * @param textId The TID whose translations should be returned
   */
  export function getTextById(textId: string): IText {
    return textById.get(textId);
  }

  /**
   * Fetches the object with all translation, sluggifies all it's values and returns the modified IText.
   * @param textId The TID whose sluggified translations should be returned
   */
  export function getSluggifiedTextById(textId: string): IText {
    const text: IText = textById.get(textId);
    const newText: IText = { ...text };

    for (const locale of Object.keys(text)) {
      newText[locale] = slug(newText[locale], slugOptions);

      // If slug doesn't exist, then we create our own slug (right now we would just use the original string)
      if (newText[locale].length === 0) {
        newText[locale] = text[locale];
      }
    }

    return newText;
  }
}
