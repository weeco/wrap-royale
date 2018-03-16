import { classToPlain, Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { ILocalPlayerRanking, LocalPlayerRanking } from './LocalPlayerRanking';

/**
 * Leaderboard rankings for players
 */
@Exclude()
export class PlayerLeaderboard {
  @Type(() => LocalPlayerRanking)
  @Expose()
  public items: LocalPlayerRanking[];

  @Expose()
  public get fetchedAt(): Date {
    return new Date();
  }

  public static FROM_JSON(playerLeaderboardJson: {}): PlayerLeaderboard {
    return plainToClass(PlayerLeaderboard, playerLeaderboardJson);
  }

  public toJson(): IPlayerLeaderboard {
    return <IPlayerLeaderboard>classToPlain(this);
  }
}

/**
 * A serialized PlayerLeaderboard
 */
export interface IPlayerLeaderboard {
  items: ILocalPlayerRanking[];
  fetchedAt: Date;
}
