import * as fs from 'fs';
import * as path from 'path';
import { IIconUrls } from '../common/types';
import { IText, LocaleHelper } from './LocaleHelper';

/**
 * Helper class for retrieving card details by name or decklink id
 */
export module ArenaHelper {
  const arenaByName: Map<string, IArenaDetails> = new Map();
  const arenaById: Map<number, IArenaDetails> = new Map();
  const arenaByNumber: Map<number, IArenaDetails> = new Map();
  const arenasJsonPath: string = path.join(__dirname, '..', '..', 'assets', 'arenas.json');
  const arenas: IArenaJson[] = <IArenaJson[]>JSON.parse(fs.readFileSync(arenasJsonPath, 'utf8'));

  // Load arena object array into Map
  const cdnUrl: string = 'https://www.clashcrown.com';
  for (const arena of arenas) {
    const arenaDetails: IArenaDetails = {
      id: arena.scid,
      name: LocaleHelper.getTextById(arena.TID),
      arena: arena.arena,
      subtitle: LocaleHelper.getTextById(arena.subtitleTID),
      trophiesRequired: arena.trophyLimit != null ? arena.trophyLimit : 0,
      seasonTrophyReset: arena.seasonTrophyReset != null ? arena.seasonTrophyReset : undefined,
      demoteTrophyLimit: arena.demoteTrophyLimit != null ? arena.demoteTrophyLimit : undefined,
      iconUrls: {
        tiny: `${cdnUrl}/img/clash-royale/arenas/${arena.scid}-tiny.png`,
        small: `${cdnUrl}/img/clash-royale/arenas/${arena.scid}-small.png`,
        medium: `${cdnUrl}/img/clash-royale/arenas/${arena.scid}-medium.png`,
        large: `${cdnUrl}/img/clash-royale/arenas/${arena.scid}-large.png`
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

interface IArenaJson {
  /**
   * Internal name used by Supercell (e.g.: 'Arena_L6')
   */
  name: string;
  TID: string;
  subtitleTID: string;
  chestArena: string;
  tvArena: string;
  isInUse?: boolean;
  trainingCamp?: boolean;
  chestRewardMultiplier: number;
  shopChestRewardMultiplier: number;
  requestSize: number;
  maxDonationCountCommon: number;
  maxDonationCountRare: number;
  maxDonationCountEpic: number;
  iconSwf: string;
  iconExportName: string;
  mainMenuIconExportName: string;
  matchmakingMaxTrophyDelta: number;
  matchmakingMaxSeconds: number;
  pvpLocation: string;
  /**
   * How many cards one can donate every day in this arena.
   */
  dailyDonationCapacityLimit?: number;
  /**
   * Rewarded amount of gold per battle.
   */
  battleRewardGold?: number;
  questCycle: string;
  scid: number;
  arena?: number;
  matchmakingMinTrophyDelta?: number;
  teamVsTeamLocation?: string;
  /**
   * Required trophies to get into this arena
   */
  trophyLimit?: number;
  /**
   * Trophy count when you will demoted to the next lower arena.
   */
  demoteTrophyLimit?: number;
  forceQuestChestCycle?: string;
  releaseDate?: string;
  seasonTrophyReset?: number;
  smallIconExportName?: string;
  seasonRewardChest?: string;
  pveArena?: boolean;
}
