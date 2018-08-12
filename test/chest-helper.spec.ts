/**
 * Test chest helper module
 */
import * as chai from 'chai';
import { ChestHelper, IChestDetails } from '../src/index';

const expect: Chai.ExpectStatic = chai.expect;
const exampleChestNames: string[] = ['Silver Chest', 'Wooden Chest', 'Super Magical Chest'];

describe('Chest Helper', () => {
  it('should return a chest by name which contains all object properties', () => {
    for (const name of exampleChestNames) {
      const chest: IChestDetails = ChestHelper.getChestByName(name);
      expect(chest.name.en)
        .to.be.a('string')
        .to.be.equal(name);
      expect(chest.slug.en).to.be.a('string');
      expect(chest.iconUrls.large)
        .to.be.a('string')
        .to.contain('https://')
        .to.contain('.png');
      expect(chest.iconUrlsOpened.large)
        .to.be.a('string')
        .to.contain('https://')
        .to.contain('.png');
    }
  });
});
