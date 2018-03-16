import { classToPlain, Exclude, Expose, plainToClass } from 'class-transformer';
import { IApiPagination } from '../../common/types';
import { ILocationDetails, LocationHelper } from '../../utils/LocationHelper';

/**
 * The location property (in clanprofile, local leaderboards and locations endpoint)
 */
@Exclude()
export class Location {
  @Expose()
  public id: number;

  public static FROM_JSON(locationJson: {}): Location {
    return plainToClass(Location, locationJson);
  }

  public toJson(): ILocation {
    return <ILocation>classToPlain(this);
  }

  public getLocationDetails(): ILocationDetails {
    return LocationHelper.getLocationById(this.id);
  }
}

/**
 * Interface for the serialized Location
 */
export interface ILocation {
  id: number;
}

/**
 * Api response interfaces
 */
export interface IApiLocations extends IApiPagination {
  items: IApiLocation[];
}

export interface IApiLocation {
  id: number;
  name: string;
  isCountry: boolean;
  countryCode?: string;
}
