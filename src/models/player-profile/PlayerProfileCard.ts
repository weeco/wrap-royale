import { Rarity } from '../../common/types';
import { ICardDetails } from '../../utils/CardHelper';
import { classToPlain, Exclude, Expose, plainToClass } from '../../utils/class-transformer/index';
import { RarityHelper } from '../../utils/RarityHelper';
import { Card, ICard } from '../common/Card';

/**
 * The card property in playerprofile
 */
@Exclude()
export class PlayerProfileCard extends Card {
  @Expose()
  public count: number;

  public static FROM_JSON(playerProfileJson: {}): PlayerProfileCard {
    return plainToClass(PlayerProfileCard, playerProfileJson);
  }

  public toJson(): IPlayerProfileCard {
    return <IPlayerProfileCard>classToPlain(this);
  }

  /**
   * Returns the current card infos as json and enriches it with card details, needed cards for an upgrade and a boolean
   * stating if the card is maxed or not.
   */
  public getPersonalizedCardDetails(): IPlayerProfileCardDetails {
    const impersonalizedCardDetails: ICardDetails = this.getCardDetails();

    return {
      ...this.toJson(),
      ...impersonalizedCardDetails,
        cardUpgradeCount: RarityHelper.getCardUpgradeCount(impersonalizedCardDetails.rarity, this.level),
        isMaxed: RarityHelper.getRarityDetailsByName(impersonalizedCardDetails.rarity).levelCount === this.level
    };
  }

  /**
   * Calculates a player's max card level after upgrading all his available cards
   */
  public getMaxUpgradeableCardLevel(): number {
    const rarity: Rarity = this.getCardDetails().rarity;
    let availableCardCount: number = this.count;
    let currentLevel: number = this.level;
    const maxLevel: number = RarityHelper.getRarityDetailsByName(rarity).levelCount;

    // Iterate 13 times to ensure we iterate through all possible card levels (1-13 common card)
    for (let i: number = 0; i < 13; i += 1) {
      if (maxLevel === currentLevel) { break; }
      const cardsNeededForUpgrade: number = RarityHelper.getCardUpgradeCount(rarity, currentLevel);
      if (cardsNeededForUpgrade == null || cardsNeededForUpgrade < 0) { break; }
      if (availableCardCount < cardsNeededForUpgrade) { break; }
      availableCardCount -= cardsNeededForUpgrade;
      currentLevel += 1;
    }

    return currentLevel;
  }
}

export interface IPlayerProfileCard extends ICard {
  count: number;
}

/**
 * Personalized card along with card details and it's card upgrade count
 */
export interface IPlayerProfileCardDetails extends ICardDetails, IPlayerProfileCard {
  /**
   * Number of needed cards to upgrade the given card to the next level
   */
  cardUpgradeCount: number;
  /**
   * True if card is maxed out, otherwise false.
   */
  isMaxed: boolean;
}
