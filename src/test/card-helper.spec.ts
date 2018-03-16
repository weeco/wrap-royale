/**
 * Card helper module
 */
import * as chai from 'chai';
import { CardHelper, ICardDetails, Locales } from '../index';

const expect: Chai.ExpectStatic = chai.expect;
const exampleCardIds: number[] = [27000000, 27000010, 26000000, 26000057, 28000000, 28000016];
const exampleCardNames: string[] = ['Knight', 'Heal', 'The Log', 'Goblin Barrel'];

describe('Card Helper', () => {
  it('should return a card by id which contains all object properties', () => {
    for (const id of exampleCardIds) {
      const card: ICardDetails = CardHelper.getCardById(id);
      expect(card).to.not.equal(undefined, 'No card has been returned');
      expect(card).to.be.a('object');

      expect(card.id).to.be.a('number').to.be.at.least(26000000).and.be.lessThan(29000000);
      expect(card.cardKey).to.be.a('string');
      expect(card.description).to.be.a('object');
      expect(card.iconUrls).to.be.a('object');
      expect(card.name).to.be.a('object');
      expect(card.elixir).to.be.a('number').to.be.at.least(1).and.be.lte(10);
      expect(card.slug).to.be.a('object');
      expect(card.unlockArena).to.be.a('string');
    }
  });

  it('should return an array of card details for multiple provided card ids', () => {
    const cardDetails: ICardDetails[] = CardHelper.getCardsByIds(exampleCardIds);
    expect(cardDetails.length).to.equal(
      exampleCardIds.length,
      'Number of returned cardDetails does not match the number of provided card ids.');
  });

  it('should return a card by name which contains all object properties', () => {
    for (const name of exampleCardNames) {
      const card: ICardDetails = CardHelper.getCardByName(name);
      expect(card).to.not.equal(undefined, `No card has been returned for ${name}`);
      expect(card).to.be.a('object');

      expect(card.id).to.be.a('number').to.be.at.least(26000000).and.be.lessThan(29000000);
      expect(card.cardKey).to.be.a('string');
      expect(card.description).to.be.a('object');
      expect(card.iconUrls).to.be.a('object');
      expect(card.name).to.be.a('object');
      expect(card.elixir).to.be.a('number').to.be.at.least(1).and.be.lte(10);
      expect(card.slug).to.be.a('object');
      expect(card.unlockArena).to.be.a('string');
    }
  });

  it('should have all translations for card names', () => {
    for (const name of exampleCardNames) {
      const card: ICardDetails = CardHelper.getCardByName(name);

      // Test for each defined locale
      const keys: (keyof typeof Locales)[] = <(keyof typeof Locales)[]>Object.keys(Locales);
      for (const key of keys) {
        const locale: Locales = Locales[key];
        expect(card.name[locale]).to.be.a('string').length.above(0);
      }
    }
  });

  it('should have all translations for card slugs', () => {
    for (const name of exampleCardNames) {
      const card: ICardDetails = CardHelper.getCardByName(name);

      // Test for each defined locale
      const keys: (keyof typeof Locales)[] = <(keyof typeof Locales)[]>Object.keys(Locales);
      for (const key of keys) {
        const locale: Locales = Locales[key];
        expect(card.slug[locale]).to.be.a('string').length.above(0);
      }
    }
  });

  it('should return an array of card details of at least 10 misisng cards', () => {
    const characterIds: number[] = [...Array(62).keys()].map((x: number) => x + 26000000);
    characterIds.push(27000010, 28000016); // Add one building and one spell as these come from other json files.
    const cardDetails: ICardDetails[] = CardHelper.getToBeFoundCards(characterIds);
    expect(cardDetails.length).to.gte(
      24,
      'Number of to be found cardDetails is too small.');
  });
});
