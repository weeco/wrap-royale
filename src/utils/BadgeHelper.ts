import { IIconUrls } from '../common/types';

/**
 * Helper class for retrieving badge details by badgeId
 */
export namespace BadgeHelper {
  const badgeById: Map<number, IBadgeDetails> = new Map();

  const minBadgeId: number = 16000000;
  const maxBadgeId: number = 16000179;
  // Load arena object array into Map

  for (let i: number = maxBadgeId; i >= minBadgeId; i -= 1) {
    const cdnUrl: string = 'https://raw.githubusercontent.com/weeco/clash-royale-assets/master/images';
    const badge: IBadgeDetails = {
      id: i,
      iconUrls: {
        large: `${cdnUrl}/badges/${i}.png`
      }
    };
    badgeById.set(i, badge);
  }

  /**
   * Returns badge details for a given badge id.
   * @param badgeId The badge's id (we use Supercell's badge ids - e.g. 16000000)
   */
  export function getBadgeById(badgeId: number): IBadgeDetails {
    return badgeById.get(badgeId);
  }
}

export interface IBadgeDetails {
  /**
   * Supercell's badge ids (16000000 - 16000179)
   */
  id: number;
  iconUrls: IIconUrls;
}
