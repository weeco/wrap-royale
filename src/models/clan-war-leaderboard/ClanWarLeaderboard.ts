import { classToPlain, Exclude, Expose, plainToClass, Type } from '../../utils/class-transformer/index';
import { ILocalClanWarRanking, LocalClanWarRanking } from './LocalClanWarRanking';

/**
 * Leaderboard rankings for clan wars
 */
@Exclude()
export class ClanWarLeaderboard {
  @Type(() => LocalClanWarRanking)
  @Expose()
  public items: LocalClanWarRanking[];

  @Expose()
  public get fetchedAt(): Date {
    return new Date();
  }

  public static FROM_JSON(clanLeaderboardJson: {}): ClanWarLeaderboard {
    return plainToClass(ClanWarLeaderboard, clanLeaderboardJson);
  }

  public toJson(): IClanWarLeaderboard {
    return <IClanWarLeaderboard>classToPlain(this);
  }
}

/**
 * A serialized ClanLeaderboard
 */
export interface IClanWarLeaderboard {
  items: ILocalClanWarRanking[];
  fetchedAt: Date;
}
