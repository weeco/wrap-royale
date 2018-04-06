import * as fs from 'fs';
import * as path from 'path';
import * as slug from 'slug';
import { IIconUrls } from '../common/types';
import { IApiLocation } from '../models/common/Location';

export interface ILocationDetails extends IApiLocation {
  iconUrls: IIconUrls;
  /**
   * Contains for a few regions a regionCode which can be used for displaying a flag (e. g. Europe = 'EU')
   */
  regionCode?: string;
  slug: string;
}

/**
 * Helper class for retrieving locations by id or name
 */
export namespace LocationHelper {
  const locationById: Map<number | string, ILocationDetails> = new Map();
  const locationBySlug: Map<string, ILocationDetails> = new Map();
  const slugOptions: {} = {
    replacement: '-', // replace spaces with replacement
    symbols: true, // replace unicode symbols or not
    remove: /[.]/g, // (optional) regex to remove characters
    lower: true, // result in lower case
    charmap: slug.charmap, // replace special characters
    multicharmap: slug.multicharmap // replace multi-characters
  };

  const countriesJsonpath: string = path.join(__dirname, '..', '..', 'assets', 'countries.json');
  const locations: IApiLocation[] = <IApiLocation[]>JSON.parse(fs.readFileSync(countriesJsonpath, 'utf8'));

  // Add icon urls for all locations
  const cdnUrl: string = 'https://www.clashcrown.com';
  // Load location object array into Map
  locations.forEach((location: IApiLocation) => {
    const locationDetailed: ILocationDetails = {
      ...location,
      iconUrls: {
        tiny: `${cdnUrl}/img/clash-royale/locations/${location.countryCode}-tiny.png`,
        small: `${cdnUrl}/img/clash-royale/locations/${location.countryCode}-small.png`,
        medium: `${cdnUrl}/img/clash-royale/locations/${location.countryCode}-medium.png`,
        large: `${cdnUrl}/img/clash-royale/locations/${location.countryCode}-large.png`
      },
      slug: slug(location.name, slugOptions)
    };

    locationById.set(location.id, locationDetailed);
    locationBySlug.set(locationDetailed.slug, locationDetailed);
  });

  /**
   * Returns location details for a given location id.
   * @param locationId The locations's id (we use Supercell's location ids - e.g. 57000000)
   */
  export function getLocationById(locationId: number): ILocationDetails {
    return locationById.get(locationId);
  }

  /**
   * Returns location details for a given location slug.
   * @param locationSlug The location's slug (e. g. 'DE')
   */
  export function getLocationBySlug(locationSlug: string): ILocationDetails {
    const lowerLocationSlug: string = locationSlug.toLowerCase();

    return locationBySlug.get(lowerLocationSlug);
  }

  /**
   * Returns an iterator for all available ILocationDetails
   */
  export function getAllLocations(): IterableIterator<ILocationDetails> {
    return locationById.values();
  }
}
