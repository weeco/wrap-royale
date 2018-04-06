import { classToPlain, Exclude, Expose, plainToClass, Transform, Type } from '../../utils/class-transformer/index';
import { HashtagHelper } from '../../utils/HashtagHelper';
import { Card, ICard } from '../common/Card';
import { Clan, IClan } from '../common/Clan';

/**
 * A Clash Royale player profile
 */
@Exclude()
export class BattleParticipant {
  @Transform((tag: string) => HashtagHelper.normalizeHashtag(tag))
  @Expose()
  public tag: string;

  @Expose() public name: string = void 0;

  @Expose() public startingTrophies: number = void 0;

  @Expose() public trophyChange: number = void 0;

  @Expose() public crowns: number = void 0;

  @Type(() => Clan)
  @Expose()
  public clan: Clan = void 0;

  @Type(() => Card)
  @Expose()
  public cards: Card[] = void 0;

  public static FROM_JSON(battleParticipantJson: {}): BattleParticipant {
    return plainToClass(BattleParticipant, battleParticipantJson);
  }

  public toJson(): IBattleParticipant {
    return <IBattleParticipant>classToPlain(this);
  }
}

/**
 * A serialized BattleParticipant
 */
export interface IBattleParticipant {
  tag: string;
  name: string;
  startingTrophies: number;
  trophyChange: number;
  crowns: number;
  clan: IClan;
  cards: ICard[];
}
