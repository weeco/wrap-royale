import { classToPlain, Exclude, Expose, plainToClass, Transform, Type } from '../../utils/class-transformer/index';
import { HashtagHelper } from '../../utils/HashtagHelper';
import { ILocation, Location } from '../common/Location';

/**
 * Leaderboard rankings for clans
 */
@Exclude()
export class LocalClanWarRanking {
  @Transform((tag: string) => HashtagHelper.normalizeHashtag(tag))
  @Expose()
  public tag: string;

  @Expose() public name: string;

  @Expose() public rank: number;

  @Expose() public previousRank: number;

  @Type(() => Location)
  @Expose()
  public location: Location;

  @Expose() public badgeId: number;

  @Expose() public clanScore: number;

  @Expose({ name: 'members' })
  public memberCount: number;

  public static FROM_JSON(localClanWarRankingJson: {}): LocalClanWarRanking {
    return plainToClass(LocalClanWarRanking, localClanWarRankingJson);
  }

  public toJson(): ILocalClanWarRanking {
    return <ILocalClanWarRanking>classToPlain(this);
  }
}

/**
 * A serialized LocalClanWarRanking
 */
export interface ILocalClanWarRanking {
  tag: string;
  name: string;
  rank: number;
  previousRank: number;
  location: ILocation;
  badgeId: number;
  clanScore: number;
  memberCount: number;
}
