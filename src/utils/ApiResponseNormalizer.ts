import { IApiAchievements,
  IApiArena,
  IApiBattleParticipant,
  IApiBattleParticipantCard,
  IApiCard,
  IApiCards,
  IApiClan,
  IApiGameMode,
  IApiLeagueStatistics,
  IApiPlayerProfile,
  IApiPlayerProfileCard,
  IApiPlayersBattleLog
} from 'wrap-royale-core';
import { ICards } from '../models/cards/Cards';
import { IBaseCard } from '../models/common/Card';
import { CardHelper } from '../utils/CardHelper';

/**
 * Module for normalizing the JSON responses to our desired JSON format
 *
 * Currently only used to modify all JSONs which contain a Card. Supercell currently returns a cardName instead
 * of a card id. However we can resolve the card id from a given card name and we want to use the card id internally.
 * Until there is an @Alias decorator in the class-transformer library (issue: https://github.com/typestack/class-transformer/issues/121)
 * we need to preprocess the JSON before passing it into the model class.
 */
export module ApiResponseNormalizer {
  /**
   * Supercell's api doesn't return card ids, but card names. We can transform the card names
   * into card ids, so that we internally only use cardIds.
   *
   * @param cardsJson The json response from Supercell's API
   */
  export function normalizeCards(cardsJson: IApiCards): ICards {
    const normalizedJson: ICards = {
      items: []
    };

    // Normalize each card in the items array
    cardsJson.items.forEach((card: IApiCard) => {
      const baseCard: IBaseCard = {
        id: CardHelper.getCardByName(card.name).id
      };
      normalizedJson.items.push(baseCard);
    });

    return normalizedJson;
  }

  /**
   * Supercell's api doesn't return card ids, but card names. We can transform the card names
   * into card ids, so that we internally only use cardIds. Cards are returned in PlayerProfiles in
   * the cards, currentFavouriteCard and currentDeck properties.
   *
   * @param playerJson The json response from Supercell's API
   */
  export function normalizePlayerProfile(playerJson: IApiPlayerProfile): IApiPlayerProfileNormalized {
    // Return new object using all the existing fields, but overwrite the properties which contain
    // Card information (replace cardname with cardIds and remove the transitive card data, e. g. maxCardLevel or icon urls)
    return {
      ...playerJson,
      cards: playerJson.cards.map(convertPlayerCard),
      currentFavouriteCard: convertBaseCard(playerJson.currentFavouriteCard),
      currentDeck: playerJson.currentDeck.map(convertPlayerCard)
    };
  }

  /**
   * Returns a new object which normalizes the cards in the participant property. Instead of cardnames and it's
   * transitive data it will only return a card id (which can be resolved using the cardName)
   * @param battleLogJson One battle log json from Supercell's API
   */
  export function normalizePlayerBattleLogs(battleLogJson: IApiPlayersBattleLog): IApiPlayerBattleLogNormalized {
    return {
      ...battleLogJson,
      team: battleLogJson.team.map(normalizeBattleLogParticipant),
      opponent: battleLogJson.opponent.map(normalizeBattleLogParticipant)
    };
  }

  /**
   * Normalizes all cards from a battle participant's card deck
   * @param participants A battle participant either from the team or opponent side
   */
  function normalizeBattleLogParticipant(participant: IApiBattleParticipant): IApiBattleLogParticipantNormalized {
    return {
      ...participant,
      cards: participant.cards.map(convertBattleCard)
    };
  }

  /**
   * Converts a "battle card" (contains only cardname and level but not count for instance)
   * @param card Battle card from a battlelog
   */
  function convertBattleCard(card: IApiBattleParticipantCard): IApiBattleLogCardNormalized {
    return {
      id: CardHelper.getCardByName(card.name).id,
      level: card.level
    };
  }

  function convertBaseCard(card: IApiCard): null | IApiPlayerProfileCurrentFavouriteCardNormalized {
    if (card == null) { return null; }

    return {
      id: CardHelper.getCardByName(card.name).id
    };
  }

  function convertPlayerCard(card: IApiPlayerProfileCard): IApiPlayerProfileCardNormalized {
    return {
      id: CardHelper.getCardByName(card.name).id,
      level: card.level,
      count: card.count
    };
  }
}

/**
 * Normalized JSON interfaces (remove transitive properties - for instance just use cardId instead of cardId AND name)
 */
// To be improved: We can't extend IApiPlayerProfile as we can't override the cards, currentDeck and currentFavouriteCard properties.
export interface IApiPlayerProfileNormalized {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  wins: number;
  losses: number;
  battleCount: number;
  threeCrownWins: number;
  challengeCardsWon: number;
  challengeMaxWins: number;
  tournamentCardsWon: number;
  tournamentBattleCount: number;
  role: string;
  donations: number;
  donationsReceived: number;
  totalDonations: number;
  clan: IApiClan;
  arena: IApiArena;
  leagueStatistics?: IApiLeagueStatistics;
  achievements: IApiAchievements[];
  cards: IApiPlayerProfileCardNormalized[];
  currentDeck?: IApiPlayerProfileCardNormalized[];
  currentFavouriteCard?: IApiPlayerProfileCurrentFavouriteCardNormalized;
}

export interface IApiPlayerProfileCardNormalized {
  id: number;
  level: number;
  count: number;
}

export interface IApiPlayerProfileCurrentFavouriteCardNormalized {
  id: number;
}

// To be improved: We can't extend IApiPlayersBattleLog as we can't override the team and opponent properties.
export interface IApiPlayerBattleLogNormalized {
  // tslint:disable-next-line:no-reserved-keywords
  type: string;
  battleTime: string;
  arena: IApiArena;
  gameMode: IApiGameMode;
  deckSelection: string;
  team: IApiBattleLogParticipantNormalized[];
  opponent: IApiBattleLogParticipantNormalized[];
  challengeId?: number;
  challengeWinCountBefore?: number;
}

// To be improved: We can't extend IApiBattleParticipant as we can't override the cards property.
export interface IApiBattleLogParticipantNormalized {
  tag: string;
  name: string;
  crowns: number;
  clan: IApiClan;
  cards: IApiBattleLogCardNormalized[];
  startingTrophies?: number;
  trophyChange?: number;
}

export interface IApiBattleLogCardNormalized {
  id: number;
  level: number;
}
