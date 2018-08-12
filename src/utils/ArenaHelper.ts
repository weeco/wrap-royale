import arenasJson from '../../assets/arenas.json';
import { IIconUrls } from '../common/types';
import { IText, LocaleHelper } from './LocaleHelper';

/**
 * Helper class for retrieving card details by name or decklink id
 */
export namespace ArenaHelper {
  const arenaByName: Map<string, IArenaDetails> = new Map();
  const arenaById: Map<number, IArenaDetails> = new Map();
  const arenaByNumber: Map<number, IArenaDetails> = new Map();

  // Load arena object array into Map
  const cdnUrl: string = 'https://raw.githubusercontent.com/weeco/clash-royale-assets/master/images';
  for (const arena of arenasJson) {
    const arenaDetails: IArenaDetails = {
      id: arena.scid,
      name: LocaleHelper.getTextById(arena.TID),
      arena: arena.arena,
      subtitle: LocaleHelper.getTextById(arena.subtitleTID),
      trophiesRequired: arena.trophyLimit != null ? arena.trophyLimit : 0,
      demoteTrophyLimit: arena.demoteTrophyLimit != null ? arena.demoteTrophyLimit : undefined,
      iconUrls: {
        large: `${cdnUrl}/arenas/${arena.scid}.png`
      },
      requestSize: arena.requestSize,
      maxDonationCountCommon: arena.maxDonationCountCommon,
      maxDonationCountEpic: arena.maxDonationCountEpic,
      maxDonationCountRare: arena.maxDonationCountRare
    };

    arenaByName.set(arena.name, arenaDetails);
    arenaById.set(arena.scid, arenaDetails);
    if (arena.arena != null) {
      arenaByNumber.set(arena.arena, arenaDetails);
    }
  }

  /**
   * Returns arena details for a given arena id.
   * @param arenaId The arena's id (we use Supercell's arena ids - e.g. 54000000)
   */
  export function getArenaById(arenaId: number): IArenaDetails {
    return arenaById.get(arenaId);
  }

  /**
   * Returns arena details by a given arena number (not id).
   * @param arenaNumber Arena number (1 - 21)
   */
  export function getArenaByNumber(arenaNumber: number): IArenaDetails {
    return arenaByNumber.get(arenaNumber);
  }

  /**
   * Returns arena details by a given name from the CSV files (not TID).
   * @param arenaName Arena name (TrainingCamp, Arena1, Arena_L, ...)
   */
  export function getArenaByCSVName(arenaName: string): IArenaDetails {
    return arenaByName.get(arenaName);
  }

  /**
   * Returns the arena details of all available arenas
   */
  export function getAllArenas(): IArenaDetails[] {
    const arenaArray: IArenaDetails[] = [];
    arenaById.forEach((value: IArenaDetails) => {
      arenaArray.push(value);
    });

    return arenaArray;
  }
}

export interface IArenaDetails {
  /**
   * Supercell's arena id (54000000 - 54000020)
   */
  id: number;
  /**
   * League name (e. g. Arena 11, League 1, League 9)
   */
  name: IText;
  /**
   * Arena name (e. g. Hog Mountain, Legendary Arena, Challenger III, Ultimate Champion)
   */
  subtitle: IText;
  /**
   * PvP Arena number (1-21)
   */
  arena?: number;
  /**
   * Required trophies to get into this arena
   */
  trophiesRequired: number;
  /**
   * Trophy count a player in this arena will be reset to on season end.
   * This reset and therefore this property only exists on higher leagues.
   */
  seasonTrophyReset?: number;
  /**
   * Trophy count when you will demoted to the next lower arena. Does not exist on training arenas and
   * on lower leagues.
   */
  demoteTrophyLimit?: number;
  /**
   * Arena images in different sizes
   */
  iconUrls: IIconUrls;
  /**
   * How many common cards can be requested with one request in that arena.
   */
  requestSize: number;
  maxDonationCountCommon: number;
  maxDonationCountRare: number;
  maxDonationCountEpic: number;
}
