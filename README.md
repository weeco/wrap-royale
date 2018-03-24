![Wrap Royale Banner](https://raw.githubusercontent.com/weeco/wrap-royale/master/wrap-royale.jpg)

# Wrap Royale
A promise based and feature rich library for requesting resources from Supercell's official Clash Royale API.

### Features

- [x] Promise based wrapper functions for API requests.
- [x] Hashtag (player- / clantags) normalization and validation using HiLo algorithm.
- [x] Throws exceptions if exceeding predefined timeouts or 4xx / 5xx status codes in response.
- [x] Extends the returned data by useful properties which are not returned yet.
- [x] Written in Typescript (provides always up to date Type definitions).
- [x] Localization supported (all supercell translations for given text ids can be resolved to their translations)
- [x] Helper modules for Cards, Arenas and Badges which allow you to get additional details (e. g. image urls or additional game related data).

**And coming up on the roadmap...**
- [ ] Own library as replacement for the used class-transformer (more focus on performance).
- [ ] Improve test coverage to 100% (also write tests to test responses against the according interfaces).
- [ ] Add useful comments for all models' properties, for a better intellisense experience (help wanted).

## Table of contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Basic usage](#basic-usage)
- [Class CRApi](#class-crapi)
  - [Instantion](#instantion)
  - [Available endpoints](#available-endpoints)  
- [Serialization and deserialization](#serialization-and-deserialization)
- [Utility Modules](#utility-modules)
  - [Arena](#arena-helper)
  - [Badge](#badge-helper)
  - [Card](#card-helper)
  - [Hashtag](#hashtag-helper)
  - [Locale](#locale-helper)
  - [Location](#location-helper)
- [Projects using this library](#projects-using-this-library)  
- [License](#license)

## Getting started
### Prerequisites
- [Node.js 8.0+](http://nodejs.org)
- Token for the official Clash Royale API (currently closed beta)

### Installation
`$ npm install --save wrap-royale`

_**Note:** Typescript definitions are included, there is no need for installing types from the Definetely Typed Repo._

### Basic usage
Typescript (2.0+):

```typescript
import { CRApi, ICard } from 'wrap-royale';

const baseUri: string = 'https://api.clashroyale.com/v1';
const apiToken: string = 'my-long-jwt';
const api: CRApi = new CRApi(baseUri, apiToken);

async function getAllCards(): Promise<void> {
  try {
    const cards: Cards = await api.cards();
    console.log(cards.toJSON());
  } catch (e) {
    console.log(e);
  }
}

getAllCards();
```

Javascript (requires ES6+):

```javascript
const CRApi = require('wrap-royale').CRApi;

const baseUri = 'https://api.clashroyale.com/v1';
const apiToken = 'my-long-jwt';
const api = new CRApi(baseUri, apiToken);

api.cards()
  .then(function (cards) {
    console.log(cards.toJSON());
  })
  .catch(function (err) {
    console.log(err);
  })
```

## Class CRApi
The class CRApi offers all available endpoints as promise based functions. Each function returns a Promise which resolves to one or multiple class instances (e. g. Card). These class offers additional properties and methods (such as `getCardDetails()`, `toJSON()` or the static method `fromJSON()`).

If you want to get a serialized class instance instead (for example to store the minimum required information in a database) please read [serialization](#serialization).

### Instantion
When creating an instance of the CRApi class you can pass a couple options which are described below:

```typescript
/**
 * Initialize all settings.
 * @param uri Base url to Clash Royale API e.g. 'https://api.clashroyale.com/v1/'.
 * @param token Your API token (JWT as string).
 * @param options Additional options for this wrapper.
 */
constructor(uri: string, token: string, options?: IApiOptions);

interface IApiOptions {
    /**
     * Timeout for awaiting a response until it fails. Defaults to 6000 milliseconds.
     */
    timeoutMS?: number;
    /**
     * Validate hashtags before requesting resource from the API. Throws an exception on invalid tags. Defaults to true.
     */
    validateTags?: boolean;
}
```


### Available endpoints
| Route                                                                                    | Returns                    |
|------------------------------------------------------------------------------------------|----------------------------|
| `cards()`                                                                                | Promise\<Cards>             |
| `locations(limit?: number, after?: string, before?: string)`                             | Promise\<Locations>         |
| `locationById(locationId: number)`                                                       | Promise\<Location>          |
| `playerLeaderboard(locationId: string, limit?: number, after?: string, before?: string)` | Promise\<PlayerLeaderboard> |
| `clanLeaderboard(locationId: string, limit?: number, after?: string, before?: string)`   | Promise\<ClanLeaderboard>   |
| `playerProfile(playerTag: string)`                                                       | Promise\<PlayerProfile>     |
| `playersUpcomingChests(playerTag: string)`                                               | Promise\<UpcomingChests>    |
| `playersBattleLogs(playerTag: string)`                                                   | Promise\<PlayerBattleLog[]> |
| `clanProfile(clanTag: string)`                                                           | Promise\<ClanProfile>       |

## Serialization and deserialization
This library returns class instances for each endpoint. These are very handy if you want to get additional details like a card's description text in any language. If you want to store the information of a specific instance (like a PlayerProfile) you can use the `toJSON()` method. You'll get a "minified" js object which you can store in your database.

All serialized objects can be deserialized as well so that you get a class instance again. Deserialization (from JSON to class object) works as well using the static `fromJSON()` class methods.

```typescript
const player: PlayerProfile = api.playerProfile('2PP');
const serializedPlayer: IPlayerProfile = player.toJSON();
const deserializedPlayer: PlayerProfile = PlayerProfile.FROM_JSON(serializedPlayer);
```

## Utility Modules
Wrap Royale provides various utility modules, providing features such as hashtag validation & normalization, HiLo algorithm (converts a hashtag into low & high ids and vice versa) or receiving card/badge/arena details by id. Each module has been exported. Accordingly you can import and use these modules like this:

Typescript (2.0+):

```typescript
import { ArenaHelper,
  IArenaDetails } from 'clash-royale-api-node';

const arena: IArenaDetails = ArenaHelper.getArenaById(54000000);
const arenaName: string = arena.name;
```

Javascript (requires ES6+):

```javascript
const ArenaHelper = require('clash-royale-api-node').ArenaHelper;

const arena = ArenaHelper.getArenaById(54000000);
const arenaName = arena.name;
```

### Arena Helper

#### Arena by id
```typescript
/**
 * Returns arena details for a given arena id.
 * @param arenaId The arena's id (we use Supercell's arena ids - e.g. 54000000)
 */
function getArenaById(arenaId: number): IArenaDetails;
```

### Badge Helper

#### Badge by id

```typescript
/**
 * Returns badge details for a given badge id.
 * @param badgeId The badge's id (we use Supercell's badge ids - e.g. 16000000)
 */
function getBadgeById(badgeId: number): IBadgeDetails;
```

### Card Helper

#### Get card by id
```typescript
/**
 * Returns card details by cardId
 * @param cardId The card's id (we use Supercell's ids)
 */
function getCardById(cardId: number): ICardDetails;
```

#### Get cards by ids
```typescript
/**
 * Returns an array of card details for a given array of card ids.
 * @param cardIds An array of card ids
 */
function getCardsByIds(cardIds: number[]): ICardDetails[];
```

#### Get card by name
```typescript
/**
 * Returns card details by card name.
 * @param cardName The card's name.
 * @param locale In what language the given name is.
 */
function getCardByName(cardName: string, locale?: Locales): ICardDetails;
```

### Hashtag Helper

#### Normalize hashtag
```typescript
/**
 * Converts Hashtag (player or clantag) to a normalized version without # or common pitfalls
 * @param {string} hashtag Player- or clantag
 */
function normalizeHashtag(hashtag: string): string;
```

#### Validate hashtag
```typescript
/**
 * Checks if a hashtag is potentially valid (hashtag '#' char is not allowed)
 */
function isValidHashtag(hashtag: string): boolean;
```

#### HiLo algorithm
```typescript
/**
 * Player Hashtags consist of high and low ids which are used for a better loadbalancing
 * on Supercells end. This HiLo algorithm reverses player tags to their hi and lo ids
 *
 * @param {string} hashtag Normalized player tag
 */
function getHiLoFromHashtag(hashtag: string): {
    high: number;
    low: number;
};

/**
 * Returns a player tag (without hashtag) for a given playerid
 * @param high Player's high bits
 * @param low Player's low bits
 */
function getHashtagFromHiLo(high: number, low: number): string;
```

### Locale Helper

#### Get translation by id
```typescript
/**
 * Resolves a TID to a translated string.
 * @param textId The TID whose translation should be returned
 * @param locale The desired locale of the to be returned translation (English by default)
 */
function getTranslationById(textId: string, locale?: Locales): string;
```

#### Get text by id 
```typescript
/**
 * Returns an object with all translations for a given text id
 * @param textId The TID whose translations should be returned
 */
function getTextById(textId: string): IText;
```

#### Get sluggified text by id
```typescript
/**
 * Fetches the object with all translation, sluggifies all it's values and returns the modified IText.
 * @param textId The TID whose sluggified translations should be returned
 */
function getSluggifiedTextById(textId: string): IText;
```

### Location Helper

#### Get location by id
```typescript
/**
 * Returns location details for a given location id.
 * @param locationId The locations's id (we use Supercell's location ids - e.g. 57000000)
 */
function getLocationById(locationId: number): ILocationDetails;
```

## Projects using this library
- ClashCrown (A stats website with lots of metrics - https://clashcrown.com/)
- ClashRoyale Discord bot

Let us know what you've built using this library! Submit an issue and I will add your project to the list :-).

## License
The MIT License (MIT)

Copyright (c) 2018 Weeco

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
