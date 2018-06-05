import raritiesJson from '../../assets/rarities.json';
import { Rarity } from '../common/types';
import { IText, LocaleHelper } from './LocaleHelper';

type IRarityJson = typeof raritiesJson[0];

export interface IRarityDetails {
  name: IText;
  /**
   * Max Level - Not zero indexed
   */
  levelCount: number;
  relativeLevel: number;
  mirrorRelativeLevel: number;
  cloneRelativeLevel: number;
  donateCapacity: number;
  sortCapacity: number;
  donateReward: number;
  donateXP: number;
  goldConversionValue: number;
  chanceWeight: number;
  balanceMultiplier: number;
  upgradeExp: number[];
  upgradeMaterialCount: number[];
  upgradeCost: number[];
  powerLevelMultiplier?: number[];
  refundGems: number;
  TID: string;
  cardBaseFileName: string;
  bigFrameExportName: string;
  cardBaseExportName: string;
  stackedCardExportName: string;
  cardRewardExportName: string;
  castEffect: string;
  infoTitleExportName: string;
  cardRarityBGExportName: string;
  sortOrder: number;
  red: number[];
  green: number[];
  blue: number[];
  appearEffect: string;
  buySound: string;
  loopEffect: string;
  cardTxtBgFrameIdx: number;
  cardGlowInstanceName: string;
  spellSelectedSound: string;
  spellAvailableSound: string;
  rotateExportName: string;
  iconSWF: string;
  iconExportName: string;
  tournamentLevelCount?: number;
}

/**
 * Helper module for retrieving rarity details depending on a card's rarity
 */
export namespace RarityHelper {
  const rarityByName: Map<string, IRarityDetails> = new Map();
  const tournamentCapByRarity: Map<string, number> = new Map([
    ['Common', 9],
    ['Rare', 7],
    ['Epic', 4],
    ['Legendary', 1]
  ]);

  // Load rarities into Map
  raritiesJson.forEach((rarity: IRarityJson) => {
    const rarityName: IText = LocaleHelper.getTextById(rarity.TID);
    const rarityDetails: IRarityDetails = {
      levelCount: rarity.levelCount,
      relativeLevel: rarity.relativeLevel,
      mirrorRelativeLevel: rarity.mirrorRelativeLevel,
      cloneRelativeLevel: rarity.cloneRelativeLevel,
      donateCapacity: rarity.donateCapacity,
      sortCapacity: rarity.sortCapacity,
      donateReward: rarity.donateReward,
      donateXP: rarity.donateXP,
      goldConversionValue: rarity.goldConversionValue,
      chanceWeight: rarity.chanceWeight,
      balanceMultiplier: rarity.balanceMultiplier,
      upgradeExp: rarity.upgradeExp,
      upgradeMaterialCount: rarity.upgradeMaterialCount,
      upgradeCost: rarity.upgradeCost,
      powerLevelMultiplier: rarity.powerLevelMultiplier,
      refundGems: rarity.refundGems,
      TID: rarity.TID,
      cardBaseFileName: rarity.cardBaseFileName,
      bigFrameExportName: rarity.bigFrameExportName,
      cardBaseExportName: rarity.cardBaseExportName,
      stackedCardExportName: rarity.stackedCardExportName,
      cardRewardExportName: rarity.cardRewardExportName,
      castEffect: rarity.castEffect,
      infoTitleExportName: rarity.infoTitleExportName,
      cardRarityBGExportName: rarity.cardRarityBGExportName,
      sortOrder: rarity.sortOrder,
      red: rarity.Red,
      green: rarity.green,
      blue: rarity.blue,
      appearEffect: rarity.appearEffect,
      buySound: rarity.buySound,
      loopEffect: rarity.loopEffect,
      cardTxtBgFrameIdx: rarity.cardTxtBgFrameIdx,
      cardGlowInstanceName: rarity.cardGlowInstanceName,
      spellSelectedSound: rarity.spellSelectedSound,
      spellAvailableSound: rarity.spellAvailableSound,
      rotateExportName: rarity.rotateExportName,
      iconSWF: rarity.iconSWF,
      iconExportName: rarity.iconExportName,
      name: rarityName,
      tournamentLevelCount: tournamentCapByRarity.get(rarityName.en)
    };
    rarityByName.set(rarity.name, rarityDetails);
  });

  /**
   * Get Rarity details for a given rarity name
   * @param rarityName The rarity name (e. g. 'Common')
   */
  export function getRarityDetailsByName(rarityName: Rarity): IRarityDetails {
    return rarityByName.get(rarityName);
  }

  /**
   * Returns the number of needed cards to upgrade a card to the next level.
   * On failed lookup it will return -1.
   *
   * @param rarityName The rarity (e. g. 'Common')
   * @param currentLevel Current card level (e. g. 12)
   */
  export function getCardUpgradeCount(rarityName: Rarity, currentLevel: number): number {
    // Index -1 because card levels are not zero indexed
    return rarityByName.get(rarityName).upgradeMaterialCount[currentLevel - 1];
  }
}
