/**
 * Test rarity helper module
 */
import * as chai from 'chai';
import { IRarityDetails, Rarity, RarityHelper } from '../index';

const expect: Chai.ExpectStatic = chai.expect;

describe('Rarity Helper', () => {
  it('should return rarity details by a given rarity name', () => {
    const rarityDetails: IRarityDetails = RarityHelper.getRarityDetailsByName(Rarity.Common);
    expect(rarityDetails.name.en).to.equal(Rarity.Common);
    expect(rarityDetails.upgradeMaterialCount[11]).to.equal(5000);
  });

  it('should return card count until next level upgrade for a given rarity and it\'s level', () => {
    const upgradeCount: number = RarityHelper.getCardUpgradeCount(Rarity.Common, 12);
    expect(upgradeCount).to.equal(5000);
  });
});
