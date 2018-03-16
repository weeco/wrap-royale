import { classToPlain, Exclude, Expose, plainToClass, Type } from 'class-transformer';

/**
 * The league statistics property in a playerprofile
 */
@Exclude()
export class LeagueStatistics {
  @Type(() => Object)
  @Expose()
  public currentSeason: {
    trophies: number;
    bestTrophies: number;
  };

  @Type(() => Object)
  @Expose()
  public previousSeason: {
    id: string;
    rank: number;
    trophies: number;
    bestTrophies: number;
  };

  @Type(() => Object)
  @Expose()
  public bestSeason: {
    id: string;
    rank: number;
    trophies: number;
  };

  public static FROM_JSON(leagueStatsJson: {}): LeagueStatistics {
    return plainToClass(LeagueStatistics, leagueStatsJson);
  }

  public toJson(): ILeagueStatistics {
    return <ILeagueStatistics>classToPlain(this);
  }
}

/**
 * A serialized LeagueStatistics
 */
export interface ILeagueStatistics {
  currentSeason?: {
    trophies: number;
    bestTrophies: number;
  };
  previousSeason?: {
    id: string;
    rank: number;
    trophies: number;
    bestTrophies: number;
  };
  bestSeason?: {
    id: string;
    rank: number;
    trophies: number;
  };
}
