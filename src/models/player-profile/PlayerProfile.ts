import { Role } from '../../common/types';
import { CardHelper, ICardDetails } from '../../utils/CardHelper';
import { classToPlain, Exclude, Expose, plainToClass, Transform, Type } from '../../utils/class-transformer/index';
import { HashtagHelper } from '../../utils/HashtagHelper';
import { Arena, IArena } from '../common/Arena';
import { BaseCard, IBaseCard } from '../common/Card';
import { Clan, IClan } from '../common/Clan';
import { HiLo, IHiLo } from '../common/HiLo';
import { ILeagueStatistics, LeagueStatistics } from './LeagueStatistics';
import { IPlayerProfileCard, IPlayerProfileCardDetails, PlayerProfileCard } from './PlayerProfileCard';

/**
 * A Clash Royale player profile
 */
@Exclude()
export class PlayerProfile {
  @Transform((tag: string) => HashtagHelper.normalizeHashtag(tag))
  @Expose()
  public tag: string;

  @Expose()
  public get accountId(): HiLo {
    const hiLo: IHiLo = HashtagHelper.getHiLoFromHashtag(this.tag);

    return new HiLo(hiLo.high, hiLo.low);
  }

  @Expose() public name: string;

  @Expose()
  public get nameNormalized(): string {
    return this.name.normalize('NFD').toLowerCase();
  }

  @Expose() public expLevel: number;

  @Expose() public trophies: number;

  @Expose() public bestTrophies: number;

  @Expose() public wins: number;

  @Expose() public losses: number;

  @Expose() public battleCount: number;

  @Expose() public threeCrownWins: number;

  @Expose() public challengeCardsWon: number;

  @Expose() public challengeMaxWins: number;

  @Expose() public tournamentCardsWon: number;

  @Expose() public tournamentBattleCount: number;

  @Expose() public role: Role;

  @Expose() public donations: number;

  @Expose() public donationsReceived: number;

  @Expose() public totalDonations: number;

  @Expose()
  @Type(() => Clan)
  public clan: Clan;

  @Expose()
  @Type(() => Arena)
  public arena: Arena;

  @Expose()
  @Type(() => LeagueStatistics)
  public leagueStatistics: LeagueStatistics;

  @Expose()
  @Type(() => PlayerProfileCard)
  public cards: PlayerProfileCard[];

  @Expose()
  @Type(() => PlayerProfileCard)
  public currentDeck: PlayerProfileCard[];

  @Expose()
  @Type(() => BaseCard)
  public currentFavouriteCard?: BaseCard;

  public static FROM_JSON(playerProfileJson: {}): PlayerProfile {
    return plainToClass(PlayerProfile, playerProfileJson);
  }

  public toJson(): IPlayerProfile {
    return <IPlayerProfile>classToPlain(this);
  }

  /**
   * Returns player profile cards (id + level + count) along with it's card details.
   */
  public getCardsDetails(): IPlayerProfileCardDetails[] {
    return this.cards.map((card: PlayerProfileCard) => card.getPersonalizedCardDetails());
  }

  /**
   * Returns card details for all cards which haven't been found by the player yet.
   */
  public getToBeFoundCards(): ICardDetails[] {
    const foundCardIds: number[] = this.cards.map((x: PlayerProfileCard) => x.id);

    return CardHelper.getToBeFoundCards(foundCardIds);
  }
}

/**
 * A serialized PlayerProfile
 */
export interface IPlayerProfile {
  tag: string;
  accountId: IHiLo;
  name: string;
  nameNormalized: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  wins: number;
  losses: number;
  battleCount: number;
  threeCrownWins: number;
  challengeCardsWon: number;
  challengeMaxWins: number;
  tournamentCardsWon: number;
  tournamentBattleCount: number;
  role?: Role;
  donations: number;
  donationsReceived: number;
  totalDonations: number;
  clan?: IClan;
  arena: IArena;
  leagueStatistics?: ILeagueStatistics;
  cards: IPlayerProfileCard[];
  currentDeck: IPlayerProfileCard[];
  currentFavouriteCard: IBaseCard;
}
