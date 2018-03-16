import { classToPlain, Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { ILocalClanRanking, LocalClanRanking } from './LocalClanRanking';

/**
 * Leaderboard rankings for clans
 */
@Exclude()
export class ClanLeaderboard {
  @Type(() => LocalClanRanking)
  @Expose()
  public items: LocalClanRanking[];

  @Expose()
  public get fetchedAt(): Date {
    return new Date();
  }

  public static FROM_JSON(clanLeaderboardJson: {}): ClanLeaderboard {
    return plainToClass(ClanLeaderboard, clanLeaderboardJson);
  }

  public toJson(): IClanLeaderboard {
    return <IClanLeaderboard>classToPlain(this);
  }
}

/**
 * A serialized ClanLeaderboard
 */
export interface IClanLeaderboard {
  items: ILocalClanRanking[];
  fetchedAt: Date;
}
