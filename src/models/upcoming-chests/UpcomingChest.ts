import { classToPlain, Exclude, Expose, plainToClass } from 'class-transformer';
import { ChestHelper, IChestDetails } from '../../index';

/**
 * A chest with it's cycle index.
 */
@Exclude()
export class UpcomingChest {
  @Expose()
  public index: number;

  @Expose()
  public name: string;

  public static FROM_JSON(playerProfileJson: {}): UpcomingChest {
    return plainToClass(UpcomingChest, playerProfileJson);
  }

  public toJson(): IUpcomingChest {
    return <IUpcomingChest>classToPlain(this);
  }

  /**
   * Returns chest details for this upcoming chest
   */
  public getChestDetails(): IChestDetails {
    return ChestHelper.getChestByName(this.name);
  }
}

/**
 * A serialized UpcomingChest
 */
export interface IUpcomingChest {
  index: number;
  name: string;
}
