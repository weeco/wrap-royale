import { classToPlain, Exclude, Expose, plainToClass, Transform, Type } from 'class-transformer';
import { HashtagHelper } from '../../utils/HashtagHelper';
import { Arena, IArena } from '../common/Arena';
import { Clan, IClan } from '../common/Clan';

/**
 * Leaderboard rankings for players
 */
@Exclude()
export class LocalPlayerRanking {
  @Transform((tag: string) => HashtagHelper.normalizeHashtag(tag))
  @Expose()
  public tag: string = void 0;

  @Expose()
  public name: string = void 0;

  @Expose()
  public expLevel: number = void 0;

  @Expose()
  public trophies: number = void 0;

  @Expose()
  public rank: number = void 0;

  @Expose()
  public previousRank: number = void 0;

  @Type(() => Clan)
  @Expose()
  public clan: Clan = void 0;

  @Type(() => Arena)
  @Expose()
  public arena: Arena = void 0;

  public static FROM_JSON(localPlayerRankingJson: {}): LocalPlayerRanking {
    return plainToClass(LocalPlayerRanking, localPlayerRankingJson);
  }

  public toJson(): ILocalPlayerRanking {
    return <ILocalPlayerRanking>classToPlain(this);
  }
}

/**
 * A serialized LocalPlayerRanking
 */
export interface ILocalPlayerRanking {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  rank: number;
  previousRank: number;
  clan: IClan;
  arena: IArena;
}
