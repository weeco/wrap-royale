import { classToPlain, Exclude, Expose, plainToClass, Type } from 'class-transformer';
import { IUpcomingChest, UpcomingChest } from './UpcomingChest';

/**
 * The upcoming chests property in a playerprofile
 */
@Exclude()
export class UpcomingChests {
  @Expose()
  @Type(() => UpcomingChest)
  public items: UpcomingChest[];

  public static FROM_JSON(upcomingChestsJson: {}): UpcomingChests {
    return plainToClass(UpcomingChests, upcomingChestsJson);
  }

  public toJson(): IUpcomingChests {
    return <IUpcomingChests>classToPlain(this);
  }

  /**
   * Returns all regular chests within the given chest cycle
   */
  public get regularChests(): UpcomingChest[] {
    return this.items.filter((x: UpcomingChest) => !x.getChestDetails().isSpecial);
  }

  /**
   * Returns all special chests within the given chest cycle
   */
  public get specialChests(): UpcomingChest[] {
    return this.items.filter((x: UpcomingChest) => x.getChestDetails().isSpecial);
  }
}

/**
 * A serialized UpcomingChests
 */
export interface IUpcomingChests {
  items: IUpcomingChest[];
}

export { UpcomingChest } from './UpcomingChest';
