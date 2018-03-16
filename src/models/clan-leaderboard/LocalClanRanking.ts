import { classToPlain, Exclude, Expose, plainToClass, Transform, Type } from 'class-transformer';
import { HashtagHelper } from '../../utils/HashtagHelper';
import { ILocation, Location } from '../common/Location';

/**
 * Leaderboard rankings for clans
 */
@Exclude()
export class LocalClanRanking {
  @Transform((tag: string) => HashtagHelper.normalizeHashtag(tag))
  @Expose()
  public tag: string;

  @Expose()
  public name: string;

  @Expose()
  public rank: number;

  @Expose()
  public previousRank: number;

  @Type(() => Location)
  @Expose()
  public location: Location;

  @Expose()
  public badgeId: number;

  @Expose()
  public clanScore: number;

  @Expose({ name: 'members' })
  public memberCount: number;

  public static FROM_JSON(localClanRankingJson: {}): LocalClanRanking {
    return plainToClass(LocalClanRanking, localClanRankingJson);
  }

  public toJson(): ILocalClanRanking {
    return <ILocalClanRanking>classToPlain(this);
  }
}

/**
 * A serialized LocalClanRanking
 */
export interface ILocalClanRanking {
  tag: string;
  name: string;
  rank: number;
  previousRank: number;
  location: ILocation;
  badgeId: number;
  clanScore: number;
  memberCount: number;
}
