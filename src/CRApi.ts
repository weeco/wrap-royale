import {
  CRApi as CoreApi,
  IApiCards,
  IApiLocation,
  IApiPlayerProfile,
  IApiPlayersBattleLog,
  IApiPlayersUpcomingChests
} from 'wrap-royale-core';
import { Cards, ICards } from './models/cards/Cards';
import { ClanLeaderboard } from './models/clan-leaderboard/ClanLeaderboard';
import { ClanProfile } from './models/clan-profile/ClanProfile';
import { Location } from './models/common/Location';
import { Locations } from './models/locations/Locations';
import { PlayerBattleLog } from './models/player-battlelog/PlayerBattleLog';
import { PlayerLeaderboard } from './models/player-leaderboard/PlayerLeaderboard';
import { PlayerProfile } from './models/player-profile/PlayerProfile';
import { UpcomingChests } from './models/upcoming-chests/UpcomingChests';
import {
  ApiResponseNormalizer,
  IApiPlayerBattleLogNormalized,
  IApiPlayerProfileNormalized
} from './utils/ApiResponseNormalizer';
import { HashtagHelper } from './utils/HashtagHelper';

/**
 * Clash Royale API
 */
export class CRApi {
  private api: CoreApi;
  private options: IApiOptions;

  /**
   * Initialize all settings.
   * @param uri Base url to Clash Royale API e.g. 'https://api.clashroyale.com/v1/'.
   * @param token Your API token (JWT as string).
   * @param options Additional options for this wrapper.
   */
  constructor(uri: string, token: string, options?: IApiOptions) {
    // Initialize default ApiOptions
    const defaultOptions: IApiOptions = {
      timeoutMS: 6000,
      validateTags: true
    };
    const fullOptions: IApiOptions = { ...defaultOptions, ...options };
    this.options = fullOptions;

    this.api = new CoreApi(uri, token, fullOptions);
  }

  /**
   * Returns information for all available Clash Royale cards.
   */
  public async cards(): Promise<Cards> {
    const cards: IApiCards = await this.api.cards();
    const normalizedCards: ICards = ApiResponseNormalizer.normalizeCards(cards);

    return Cards.FROM_JSON(normalizedCards);
  }

  /**
   * Returns a list of all available locations.
   */
  public async locations(): Promise<Locations> {
    const locations: {} = await this.api.locations();

    return Locations.FROM_JSON(locations);
  }

  /**
   * Returns details for a specific location.
   * @param locationId Identifier of the location to retrieve.
   */
  public async locationById(locationId: number): Promise<Location> {
    const location: IApiLocation = await this.api.locationById(locationId);

    return Location.FROM_JSON(location);
  }

  /**
   * Get clan rankings for a specific location.
   * @param locationId Identifier of the location to retrieve rankings for. Use 'global' for global leaderboards.
   */
  public async clanLeaderboard(locationId: number | 'global'): Promise<ClanLeaderboard> {
    const clanLeaderboard: {} = await this.api.clanLeaderboard(locationId);

    return ClanLeaderboard.FROM_JSON(clanLeaderboard);
  }

  /**
   * Get player rankings for a specific location.
   * @param locationId Identifier of the location to retrieve rankings for. Use 'global' for global leaderboards.
   */
  public async playerLeaderboard(locationId: number | 'global'): Promise<PlayerLeaderboard> {
    const playerLeaderboard: {} = await this.api.playerLeaderboard(locationId);

    return PlayerLeaderboard.FROM_JSON(playerLeaderboard);
  }

  /**
   * Get information about a single player by player tag.
   * @param playerTag Tag of the player to retrieve.
   */
  public async playerProfile(playerTag: string): Promise<PlayerProfile> {
    const validatedTag: string = this.validateTag(playerTag);
    const profile: IApiPlayerProfile = await this.api.playerProfile(validatedTag);
    const profileNormalized: IApiPlayerProfileNormalized = ApiResponseNormalizer.normalizePlayerProfile(profile);

    return PlayerProfile.FROM_JSON(profileNormalized);
  }

  /**
   * Get information about a player's upcoming chests.
   * @param playerTag Tag of the player whose upcoming chests to retrieve.
   */
  public async playersUpcomingChests(playerTag: string): Promise<UpcomingChests> {
    const validatedTag: string = this.validateTag(playerTag);
    const chests: IApiPlayersUpcomingChests = await this.api.playersUpcomingChests(validatedTag);

    return UpcomingChests.FROM_JSON(chests);
  }

  /**
   * Get information about a player's battle logs.
   * @param playerTag Tag of the player whose battle logs to retrieve.
   */
  public async playersBattleLogs(playerTag: string): Promise<PlayerBattleLog[]> {
    const validatedTag: string = this.validateTag(playerTag);
    const battleLogs: IApiPlayersBattleLog[] = await this.api.playersBattleLogs(validatedTag);
    const battleLogsNormalized: IApiPlayerBattleLogNormalized[] = battleLogs.map(
      ApiResponseNormalizer.normalizePlayerBattleLogs
    );

    return battleLogsNormalized.map((x: {}) => PlayerBattleLog.FROM_JSON(x));
  }

  /**
   * Get information about a clan.
   * @param clanTag Tag of the clan to retrieve.
   */
  public async clanProfile(clanTag: string): Promise<ClanProfile> {
    const validatedTag: string = this.validateTag(clanTag);
    const clanProfile: {} = await this.api.clanProfile(validatedTag);

    return ClanProfile.FROM_JSON(clanProfile);
  }

  /**
   * Normalizes a ingame hashtag and validates if option is set. Throws an exception
   * if validation fails.
   * @param playerTag Clan- or playertag which should be validated and normalized.
   */
  private validateTag(hashtag: string): string {
    if (!Boolean(hashtag)) {
      throw new Error('Empty hashtag is invalid!');
    }
    const noramlizedHashtag: string = HashtagHelper.normalizeHashtag(hashtag);
    const isValidTag: boolean = HashtagHelper.isValidHashtag(noramlizedHashtag);
    if (this.options.validateTags && !isValidTag) {
      throw new Error(`Hashtag '${noramlizedHashtag}' appears to be invalid.`);
    }

    return `#${noramlizedHashtag}`;
  }
}

/**
 * Library interfaces
 */
export interface IApiOptions {
  /**
   * Timeout for awaiting a response until it fails. Defaults to 6000 milliseconds.
   */
  timeoutMS?: number;
  /**
   * Validate player tags before requesting resource from the API. Throws exceptions on invalid tags. Defaults to true.
   */
  validateTags?: boolean;
}
