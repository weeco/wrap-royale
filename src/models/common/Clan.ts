import { classToPlain, Exclude, Expose, plainToClass, Transform } from '../../utils/class-transformer/index';
import { HashtagHelper } from '../../utils/HashtagHelper';

/**
 * The clan property (in playerprofile, battlelogs or player leaderboards)
 */
@Exclude()
export class Clan {
  @Transform((tag: string) => HashtagHelper.normalizeHashtag(tag))
  @Expose()
  public tag: string;

  @Expose() public name: string;

  @Expose() public badgeId: number;

  public static FROM_JSON(clanJson: {}): Clan {
    return plainToClass(Clan, clanJson);
  }

  public toJson(): IClan {
    return <IClan>classToPlain(this);
  }
}

/**
 * A serialized Clan
 */
export interface IClan {
  tag: string;
  name: string;
  badgeId: number;
}
