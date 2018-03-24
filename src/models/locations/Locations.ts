import { classToPlain, Exclude, Expose, plainToClass, Type } from '../../utils/class-transformer/index';
import { ILocation, Location } from '../common/Location';

/**
 * List of all available locations
 */
@Exclude()
export class Locations {
  @Type(() => Location)
  @Expose()
  public items: Location[];

  public static FROM_JSON(locationsJson: {}): Locations {
    return plainToClass(Locations, locationsJson);
  }

  public toJson(): ILocations {
    return <ILocations>classToPlain(this);
  }

  public get countries(): Location[] {
    return this.items.filter((x: Location) => x.getLocationDetails().isCountry);
  }

  public get regions(): Location[] {
    return this.items.filter((x: Location) => !x.getLocationDetails().isCountry);
  }
}

/**
 * A serialized Locations instance
 */
export interface ILocations {
  items: ILocation[];
}
