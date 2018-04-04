import * as fs from 'fs';
import * as path from 'path';
import { IIconUrls, Rarity } from '../common/types';
import { IText, LocaleHelper, Locales } from './LocaleHelper';
import { RarityHelper } from './RarityHelper';

export enum CardType {
  Character = 'character',
  Spell = 'spell',
  Building = 'building'
}

/**
 * Helper class for retrieving card details by name or decklink id
 */
export module CardHelper {
  const cardsById: Map<number, ICardDetails> = new Map();
  const cardsByName: Map<string, ICardDetails> = new Map();
  const cardIds: Set<number> = new Set();
  const cdnUrl: string = 'https://www.clashcrown.com';

  const spellsJsonpath: string = path.join(__dirname, '..', '..', 'assets', 'spells_other.json');
  const charactersJsonPath: string = path.join(__dirname, '..', '..', 'assets', 'spells_characters.json');
  const buildingsJsonPath: string = path.join(__dirname, '..', '..', 'assets', 'spells_buildings.json');
  const spells: ISpellJson[] = <ISpellJson[]>JSON.parse(fs.readFileSync(spellsJsonpath, 'utf8'));
  const characters: ICharacterJson[] = <ICharacterJson[]>JSON.parse(fs.readFileSync(charactersJsonPath, 'utf8'));
  const buildings: IBuildingJson[] = <IBuildingJson[]>JSON.parse(fs.readFileSync(buildingsJsonPath, 'utf8'));

  // Load cards object array into Maps
  for (const card of spells) {
    const cardNormalized: ICardDetails = convertToCardDetails(card, CardType.Spell);
    if (cardNormalized == null) { continue; }
    addCardToMaps(cardNormalized);
  }

  for (const card of characters) {
    const cardNormalized: ICardDetails = convertToCardDetails(card, CardType.Character);
    if (cardNormalized == null) { continue; }
    addCardToMaps(cardNormalized);
  }

  for (const card of buildings) {
    const cardNormalized: ICardDetails = convertToCardDetails(card, CardType.Building);
    if (cardNormalized == null) { continue; }
    addCardToMaps(cardNormalized);
  }

  /**
   * Adds a card with all it's details to the maps. For each locale one entry has to be made, so that we can
   * lookup the card by any localized name.
   * @param card Card with all details to be added
   */
  function addCardToMaps(card: ICardDetails): void {
    cardIds.add(card.id);
    cardsById.set(card.id, card);
    const keys: (keyof typeof Locales)[] = <(keyof typeof Locales)[]>Object.keys(Locales);
    for (const key of keys) {
      const locale: string = Locales[key];
      cardsByName.set(`${locale}-${card.name[locale]}`, card);
    }
  }

  /**
   * Tries to convert a given character, spell or building to ICardDetails. If that fails it will return null.
   * @param card Either a character, spell or building which shall be normalized
   */
  function convertToCardDetails(card: ICharacterJson | ISpellJson | IBuildingJson, cardType: CardType): ICardDetails {
    // Filter invalid objects first
    if (card.TID == null || (card.notInUse != null && card.notInUse)) {
      return null;
    }

    const cardText: IText = LocaleHelper.getTextById(card.TID);
    const cardSlugs: IText = LocaleHelper.getSluggifiedTextById(card.TID);
    const cardRarity: Rarity = <Rarity>card.rarity;

    return {
      id: card.scid,
      slug: cardSlugs,
      cardKey: card.iconFile,
      name: cardText,
      description: LocaleHelper.getTextById(card.TID_INFO),
      iconUrls: {
        tiny: `${cdnUrl}/img/clash-royale/cards/${cardSlugs.en}-tiny.png`,
        small: `${cdnUrl}/img/clash-royale/cards/${cardSlugs.en}-small.png`,
        medium: `${cdnUrl}/img/clash-royale/cards/${cardSlugs.en}-medium.png`,
        large: `${cdnUrl}/img/clash-royale/cards/${cardSlugs.en}-large.png`
      },
      elixir: card.manaCost,
      cardType,
      rarity: <Rarity>card.rarity,
      unlockArena: card.unlockArena,
      maxLevel: RarityHelper.getRarityDetailsByName(cardRarity).levelCount,
      maxTournamentLevel: RarityHelper.getRarityDetailsByName(cardRarity).tournamentLevelCount
    };
  }

  /**
   * Returns card details by cardId
   * @param cardId The card's id (we use Supercell's ids)
   */
  export function getCardById(cardId: number): ICardDetails {
    const card: ICardDetails = cardsById.get(cardId);
    if (card == null) { throw new TypeError(`A card with the id '${cardId}' does not exist`); }

    return card;
  }

  /**
   * Returns an array of card details for a given array of card ids.
   * @param localCardIds An array of card ids
   */
  export function getCardsByIds(localCardIds: number[]): ICardDetails[] {
    const cardDetails: ICardDetails[] = [];
    for (const id of localCardIds) {
      cardDetails.push(getCardById(id));
    }

    return cardDetails;
  }

  /**
   * Returns card details by card name.
   * @param cardName The card's name.
   * @param locale In what language the given name is.
   */
  export function getCardByName(cardName: string, locale: Locales = Locales.En): ICardDetails {
    const card: ICardDetails = cardsByName.get(`${locale}-${cardName}`);
    if (card == null) { throw new TypeError(`A card with the name '${cardName}' does not exist for the Locale '${locale}'`); }

    return card;
  }

  /**
   * Returns all card details sorted by their name.
   */
  export function getAllCardsSortedByName():  Map<string, ICardDetails> {
    return cardsByName;
  }

  /**
   * Returns all card details sorted by their id.
   */
  export function getAllCardsSortedById():  Map<number, ICardDetails> {
    return cardsById;
  }

  /**
   * Pass an array of cardIds and you will get all "not mentioned" Cards back.
   *
   * Example: You want to pass all cardIds of a player's found cards. This method will return an array of cardDetails
   * of all missing / to be found cards.
   * @param existingCardIds An array of cardIds which already have been found
   */
  export function getToBeFoundCards(existingCardIds: number[]): ICardDetails[] {
    const existingCardSet: Set<number> = new Set(existingCardIds);
    const missingCardIds: number[] = [...cardIds].filter((x: number) => !existingCardSet.has(x));

    return missingCardIds.map((x: number) => cardsById.get(x));
  }
}

export interface ICardDetails {
  /**
   * Supercell's card id (26000000 - 28xxxxxx).
   */
  id: number;
  /**
   * Localized slugs of card names.
   */
  slug: IText;
  /**
   * Supercell's internal card name.
   */
  cardKey: string;
  /**
   * Localized card names.
   */
  name: IText;
  /**
   * Localized card descriptions.
   */
  description: IText;
  iconUrls?: IIconUrls;
  /**
   * Elixir cost for this card.
   */
  elixir: number;
  /**
   * Is this card a character, spell or building.
   */
  cardType: CardType;
  /**
   * The card rarity (e.g. 'Common').
   */
  rarity: Rarity;
  /**
   * At what arena can you get this card from chests.
   */
  unlockArena: string;
  /**
   * The max level for the given card.
   */
  maxLevel: number;
  /**
   * The max level for the given card on tournament standard.
   */
  maxTournamentLevel: number;
}

export interface IBuildingJson {
  name: string;
  iconFile: string;
  unlockArena: string;
  rarity: string;
  manaCost: number;
  summonCharacter: string;
  castSound: string;
  TID: string;
  TID_INFO: string;
  scid: number;
  notInUse?: boolean;
}

export interface ICharacterJson {
  name: string;
  iconFile: string;
  unlockArena: string;
  rarity: string;
  manaCost: number;
  summonCharacter: string;
  effect: string;
  TID: string;
  TID_INFO: string;
  scid: number;
  summonNumber?: number;
  onlyOwnTroops?: boolean;
  summonRadius?: number;
  summonCharacterLevelIndex?: number;
  statsUnderInfo?: boolean;
  canDeployOnEnemySide?: boolean;
  touchdownLimitedDeploy?: boolean;
  summonCharacterSecond?: string;
  summonCharacterSecondCount?: number;
  radius?: number;
  iconSWF?: string;
  notInUse?: boolean;
  releaseDate?: string;
  summonDeployDelay?: number;
  projectile?: string;
  height?: number;
}

export interface ISpellJson {
  name: string;
  iconFile: string;
  unlockArena: string;
  rarity: string;
  manaCost: number;
  projectile?: string;
  canPlaceOnBuildings: boolean;
  onlyEnemies?: boolean;
  canDeployOnEnemySide?: boolean;
  castSound: string;
  TID: string;
  TID_INFO: string;
  scid: number;
  radius?: number;
  effect?: string;
  multipleProjectiles?: number;
  customFirstProjectile?: string;
  onlyOwnTroops?: boolean;
  areaEffectObject?: string;
  touchdownLimitedDeploy?: boolean;
  mirror?: boolean;
  spellAsDeploy?: boolean;
  indicatorFileName?: string;
  indicatorEffect?: string;
  hideRadiusIndicator?: boolean;
  notInUse?: boolean;
}
