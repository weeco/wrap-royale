import moment from 'moment';
import { BattleType, Deckselection } from '../../common/types';
import { classToPlain, Exclude, Expose, plainToClass, Transform, Type } from '../../utils/class-transformer/index';
import { Arena, IArena } from '../common/Arena';
import { Card } from '../common/Card';
import { Challenge } from '../common/Challenge';
import { GameMode } from '../common/GameMode';
import { BattleParticipant, IBattleParticipant } from './BattleParticipant';

function sortParticipantsDecksByCardIds(participants: BattleParticipant[]): Card[] {
  // Push all participants' cards into cards.
  const cards: Card[] = [];
  for (const participant of participants) {
    for (const card of participant.cards) {
      cards.push(card);
    }
  }

  // Sort cards by cardId
  cards.sort((a: Card, b: Card) => a.id - b.id);

  return cards;
}

/**
 * A Clash Royale player profile
 */
@Exclude()
export class PlayerBattleLog {
  @Expose({ name: 'type' })
  public battleType: BattleType;

  @Transform((battleDateString: string) =>
    moment(battleDateString)
      .utc()
      .toDate()
  )
  @Expose()
  public battleTime: Date;

  @Type(() => Arena)
  @Expose()
  public arena: Arena;

  @Type(() => GameMode)
  @Expose()
  public gameMode: GameMode;

  @Type(() => Challenge)
  @Expose()
  public challengeId?: number;

  @Expose() public challengeWinCountBefore?: number;

  @Expose() public deckSelection: Deckselection;

  @Type(() => BattleParticipant)
  @Expose()
  public team: BattleParticipant[];

  @Type(() => BattleParticipant)
  @Expose()
  public opponent: BattleParticipant[];

  public static FROM_JSON(playerBattleLogJson: {}): PlayerBattleLog {
    return plainToClass(PlayerBattleLog, playerBattleLogJson);
  }

  /**
   * Team crowns (max. 3)
   */
  @Expose()
  public get teamCrowns(): number {
    return this.team[0].crowns;
  }

  /**
   * Opponent crowns (max. 3)
   */
  @Expose()
  public get opponentCrowns(): number {
    return this.opponent[0].crowns;
  }

  /**
   * All cards used on the team side (all battle participants)
   */
  public getTeamDeck(): Card[] {
    return sortParticipantsDecksByCardIds(this.team);
  }

  /**
   * All cards used on the opponent side (all battle participants)
   */
  public getOpponentDeck(): Card[] {
    return sortParticipantsDecksByCardIds(this.opponent);
  }

  /**
   * Concatenated decklink ids of all cards used on the team side in ASCENDING order (e. g. 204007, 204008)
   */
  public getTeamDeckString(): string {
    const cardIds: number[] = this.getTeamDeck().map((x: Card) => x.id);

    return cardIds.join(',');
  }

  /**
   * Concatenated decklink ids of all cards used on the opponent side in ASCENDING order (e. g. 204007, 204008)
   */
  public getOpponentDeckString(): string {
    const cardIds: number[] = this.getOpponentDeck().map((x: Card) => x.id);

    return cardIds.join(',');
  }

  public toJson(): IPlayerBattleLog {
    return <IPlayerBattleLog>classToPlain(this);
  }
}

/**
 * A serialized PlayersBattlelog
 */
export interface IPlayerBattleLog {
  // tslint:disable-next-line:no-reserved-keywords
  type: BattleType;
  battleTime: string;
  arena: IArena;
  gameMode: GameMode;
  challengeId?: number;
  challengeWinCountBefore?: number;
  deckSelection: Deckselection;
  team: IBattleParticipant[];
  opponent: IBattleParticipant[];
}
