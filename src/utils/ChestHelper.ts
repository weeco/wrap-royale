import { IIconUrls } from '../common/types';
import { IText, LocaleHelper, Locales } from './LocaleHelper';

/**
 * Helper class for retrieving badge details by badgeId
 */
export module ChestHelper {
  const chestsByName: Map<string, IChestDetails> = new Map();
  const cdnUrl: string = 'https://www.clashcrown.com';

  const chestTextIds: string[] = [
    'TID_CHEST_WOOD',
    'TID_CHEST_SILVER',
    'TID_CHEST_GOLD',
    'TID_CHEST_MAGICAL',
    'TID_CHEST_GIANT',
    'TID_CHEST_SUPER',
    'TID_CHEST_LEGENDARY',
    'TID_CHEST_EPIC',
    'TID_CHEST_SKIN', // Tower chest
    'TID_CHEST_DRAFT', // Draft chest
    'TID_CHEST_ITEM_LEGENDARY', // Legendary chest
    'TID_CHEST_SHOP_SMALL', // Lightning chest
    'TID_CHEST_SHOP_MEDIUM', // Fortune Chest
    'TID_CHEST_SHOP_LARGE', // King's chest
    'TID_CHEST_SHOP_LARGE_LEGENDARY' // Legendary King's chest
  ];

  const specialChests: string[] = [
    'TID_CHEST_MAGICAL',
    'TID_CHEST_GIANT',
    'TID_CHEST_SUPER',
    'TID_CHEST_LEGENDARY',
    'TID_CHEST_EPIC',
    'TID_CHEST_ITEM_LEGENDARY'
  ];

  for (const tid of chestTextIds) {
    const chestName: IText = LocaleHelper.getTextById(tid);
    const chestSlugs: IText = LocaleHelper.getSluggifiedTextById(tid);
    const chestDetails: IChestDetails = {
      name: chestName,
      iconUrls: {
        tiny: `${cdnUrl}/img/clash-royale/chests/${chestSlugs.en}-tiny.png`,
        small: `${cdnUrl}/img/clash-royale/chests/${chestSlugs.en}-small.png`,
        medium: `${cdnUrl}/img/clash-royale/chests/${chestSlugs.en}-medium.png`,
        large: `${cdnUrl}/img/clash-royale/chests/${chestSlugs.en}-large.png`
      },
      iconUrlsOpened: {
        tiny: `${cdnUrl}/img/clash-royale/chests/${chestSlugs.en}-opened-tiny.png`,
        small: `${cdnUrl}/img/clash-royale/chests/${chestSlugs.en}-opened-small.png`,
        medium: `${cdnUrl}/img/clash-royale/chests/${chestSlugs.en}-opened-medium.png`,
        large: `${cdnUrl}/img/clash-royale/chests/${chestSlugs.en}-opened-large.png`
      },
      slug: LocaleHelper.getSluggifiedTextById(tid),
      isSpecial: specialChests.indexOf(tid) > -1
    };

    // Set chest for each localized name
    const keys: (keyof typeof Locales)[] = <(keyof typeof Locales)[]>Object.keys(Locales);
    for (const key of keys) {
      const locale: string = Locales[key];
      chestsByName.set(`${locale}-${chestDetails.name[locale]}`, chestDetails);
    }
  }

  /**
   * Returns chest details for a given chest name.
   * @param badgeId The badge's id (we use Supercell's badge ids - e.g. 16000000)
   */
  export function getChestByName(chestName: string, locale: Locales = Locales.En): IChestDetails {
    return chestsByName.get(`${locale}-${chestName}`);
  }
}

export interface IChestDetails {
  /**
   * Supercell's names (e. g. 'Silver Chest') in all languages.
   */
  name: IText;
  /**
   * Slugified chest names (e. g. 'silver-chest') in all languages.
   */
  slug: IText;
  /**
   * Closed chest images.
   */
  iconUrls: IIconUrls;
  /**
   * Opened chest images.
   */
  iconUrlsOpened: IIconUrls;
  /**
   * True if it's a special chest (like legendary) otherwise false.
   */
  isSpecial: boolean;
}
